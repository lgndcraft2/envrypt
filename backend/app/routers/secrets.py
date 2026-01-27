from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from ..dependencies import get_current_user, get_scoped_client, get_service_token_header, get_valid_service_token, supabase, supabase_admin
from ..crypto import encrypt_value, decrypt_value, hash_token
from ..utils import log_audit_event
from ..limiter import limiter

router = APIRouter()

class SecretCreate(BaseModel):
    vault_id: str
    key: str
    value: str

class VaultCreate(BaseModel):
    team_id: str
    name: str
    description: str = None
    color: str = None
    icon: str = None
    member_ids: List[str] = []

@router.get("/vaults")
def list_vaults(team_id: str, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # Fetch vaults with secret count
        response = client.table("vaults").select("*, secrets(count)").order('created_at', desc=True).eq("team_id", team_id).execute()
        
        data = response.data
        # Flatten the structure
        for vault in data:
            if 'secrets' in vault and isinstance(vault['secrets'], list) and len(vault['secrets']) > 0:
                vault['secrets_count'] = vault['secrets'][0]['count']
            else:
                vault['secrets_count'] = 0
            
            # Clean up
            if 'secrets' in vault:
                del vault['secrets']
                
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/vaults")
def create_vault(vault: VaultCreate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # Check for duplicate name in team
        existing = client.table("vaults").select("id").eq("team_id", vault.team_id).eq("name", vault.name).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="A vault with this name already exists in the team.")

        payload = {
            "team_id": vault.team_id,
            "name": vault.name
        }
        if vault.description:
            payload['description'] = vault.description
        if vault.color:
            payload['color'] = vault.color
        if vault.icon:
            payload['icon'] = vault.icon

        response = client.table("vaults").insert(payload).execute()
        
        if len(response.data) > 0:
            new_vault = response.data[0]
            
            # Handle Access Control
            # We always add the creator to the access list
            access_uids = set(vault.member_ids)
            access_uids.add(user.id)
            
            if access_uids:
                try:
                    access_entries = [{"vault_id": new_vault['id'], "user_id": uid} for uid in access_uids]
                    # Use admin client to bypass RLS for permissions setup
                    target_client = supabase_admin if supabase_admin else client
                    target_client.table("vault_access").insert(access_entries).execute()
                except Exception as acc_e:
                    print(f"Warning: Failed to update vault_access table. Ensure table exists. {acc_e}")
                    # Validate if 'vault_access' table exists in your Supabase project

            # Log Audit
            log_audit_event(
                client=client,
                action="CREATED",
                description=f"Created new vault {vault.name}",
                team_id=vault.team_id,
                resource_id=new_vault['id'],
                resource_type="vault",
                actor_id=user.id,
                actor_name=user.email.split('@')[0], # Fallback name
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            return new_vault
        raise HTTPException(status_code=400, detail="Failed to create vault")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class VaultAccessUpdate(BaseModel):
    member_ids: List[str]

@router.get("/vaults/{vault_id}")
def get_vault(vault_id: str, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # 1. Fetch Vault Metadata (to get team_id for audit logging and verify existence)
        response = client.table("vaults").select("*").eq("id", vault_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Vault not found")
        vault = response.data[0]

        # 2. Check Access
        # We check if a row exists in vault_access for (vault_id, user.id)
        access_res = client.table("vault_access").select("user_id").eq("vault_id", vault_id).eq("user_id", user.id).execute()
        
        has_access = len(access_res.data) > 0
        if not has_access:
            # Check if Owner/Admin of the team? (Optional, but usually admins have override)
            # For now, strict check against vault_access + maybe team owner logic if needed.
            # Let's enforce strict list for now as per "only allow... if they are allowed to"
            
            # Log Failure
            log_audit_event(
                client=client,
                action="VAULT_ACCESS_DENIED",
                description=f"User attempted to access vault {vault['name']} without permission",
                team_id=vault['team_id'],
                resource_id=vault['id'],
                resource_type="vault",
                actor_id=user.id,
                actor_name=user.email,
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            raise HTTPException(status_code=403, detail="You do not have access to this vault")

        # Log Success (Noise warning: this will log every time they click the vault)
        log_audit_event(
            client=client,
            action="VAULT_ACCESSED",
            description=f"User accessed vault {vault['name']}",
            team_id=vault['team_id'],
            resource_id=vault['id'],
            resource_type="vault",
            actor_id=user.id,
            actor_name=user.email,
            actor_type="user",
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )

        return vault
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vaults/{vault_id}/access")
def get_vault_access(vault_id: str, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        target_client = supabase_admin if supabase_admin else client
        
        # Security: Check if user is in the access list for this vault
        user_access = target_client.table("vault_access").select("user_id").eq("vault_id", vault_id).eq("user_id", user.id).execute()
        is_member = len(user_access.data) > 0
        
        if not is_member:
             # Fallback: Check if Team Admin/Owner (they should see access even if not explicitly in list)
            vault_res = target_client.table("vaults").select("team_id").eq("id", vault_id).execute()
            if vault_res.data:
                team_id = vault_res.data[0]['team_id']
                member_res = target_client.table("team_members").select("role").eq("team_id", team_id).eq("user_id", user.id).execute()
                if member_res.data:
                    role = member_res.data[0]['role'].upper()
                    if role not in ['OWNER', 'ADMIN']:
                        raise HTTPException(status_code=403, detail="You do not have permission to view access settings for this vault.")
                else:
                    raise HTTPException(status_code=403, detail="You do not have permission to view access settings for this vault.")
            else:
                 raise HTTPException(status_code=404, detail="Vault not found")

        # Use admin client to fetch ALL access entries, bypassing RLS
        response = target_client.table("vault_access").select("user_id").eq("vault_id", vault_id).execute()
        return [r['user_id'] for r in response.data]
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/vaults/{vault_id}/access")
def update_vault_access(vault_id: str, update: VaultAccessUpdate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        target_client = supabase_admin if supabase_admin else client
        
        # Security: Verify permission. Only Team Admins/Owners
        vault_res = target_client.table("vaults").select("team_id").eq("id", vault_id).execute()
        if not vault_res.data:
            raise HTTPException(status_code=404, detail="Vault not found")
        team_id = vault_res.data[0]['team_id']
        
        # Check team role
        member_res = target_client.table("team_members").select("role").eq("team_id", team_id).eq("user_id", user.id).execute()
        if not member_res.data:
             raise HTTPException(status_code=403, detail="You are not a member of this team")
        
        role = member_res.data[0]['role'].upper()
        if role not in ['OWNER', 'ADMIN']:
             raise HTTPException(status_code=403, detail="Only Team Admins can manage vault access.")

        # Determine current access
        current_res = target_client.table("vault_access").select("user_id").eq("vault_id", vault_id).execute()
        current_ids = set(r['user_id'] for r in current_res.data)
        new_ids = set(update.member_ids)
        
        to_add = new_ids - current_ids
        to_remove = current_ids - new_ids
        
        if to_remove:
            target_client.table("vault_access").delete().eq("vault_id", vault_id).in_("user_id", list(to_remove)).execute()
            
        if to_add:
            entries = [{"vault_id": vault_id, "user_id": uid} for uid in to_add]
            target_client.table("vault_access").insert(entries).execute()
            
        return {"status": "success"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


class VaultUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

@router.patch("/vaults/{vault_id}")
def update_vault(vault_id: str, vault_update: VaultUpdate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # TODO: verify permissions (Team Admin or Vault Owner)
        # RLS should handle "can update own vaults", but we might need logic for "Team Admins"
        
        payload = {k: v for k, v in vault_update.dict().items() if v is not None}
        if not payload:
            return {"status": "no change"}
            
        response = client.table("vaults").update(payload).eq("id", vault_id).execute()
        
        if not response.data:
            # If RLS prevented update or id not found
             raise HTTPException(status_code=404, detail="Vault not found or permission denied")
             
        # Log Audit
        if response.data:
            updated_vault = response.data[0]
            log_audit_event(
                client=client,
                action="VAULT_UPDATED",
                description=f"Updated vault {updated_vault.get('name')}",
                team_id=updated_vault.get('team_id'),
                resource_id=vault_id,
                resource_type="vault",
                actor_id=user.id,
                actor_name=user.email,
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/vaults/{vault_id}")
def delete_vault(vault_id: str, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # 1. Fetch vault to confirm existence and getting team_id for audit
        # RLS will ensure user has permission to 'select' this vault at least.
        # But for DELETE, we might need stronger checks.
        res = client.table("vaults").select("*").eq("id", vault_id).execute()
        if not res.data:
             raise HTTPException(status_code=404, detail="Vault not found or permission denied")
        vault_info = res.data[0]

        # 2. Check Permissions (Optional but recommended)
        # e.g., Check if user is Admin of the team.
        # For now, we rely on RLS 'delete' policy on 'vaults' table.
        # Assuming RLS says: "Only Team Owners/Admins can delete vaults"

        # 3. Delete Vault
        # Note: If foreign keys are set to CASCADE (secrets, vault_access), this cleans everything.
        # If not, we might fail or leave orphans. Assuming CASCADE on DB level.
        # If not CASCADE, we should manually delete secrets and access first.
        # Let's try to delete access first using admin just in case
        
        target_client = supabase_admin if supabase_admin else client
        try:
             target_client.table("vault_access").delete().eq("vault_id", vault_id).execute()
        except:
             pass # Might fail or be unnecessary

        del_res = client.table("vaults").delete().eq("id", vault_id).execute()
        
        if not del_res.data:
             raise HTTPException(status_code=403, detail="Failed to delete vault. Permission denied.")

        # 4. Audit
        log_audit_event(
            client=client,
            action="VAULT_DELETED",
            description=f"Deleted vault {vault_info['name']}",
            team_id=vault_info['team_id'],
            resource_id=vault_id,
            resource_type="vault",
            actor_id=user.id,
            actor_name=user.email.split('@')[0],
            actor_type="user",
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )
        return {"success": True}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/secrets")
def create_secret(secret: SecretCreate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")

    # Encrypt (Envelope)
    try:
        encryption_result = encrypt_value(secret.value)
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Encryption configuration error")

    # Insert
    try:
        # RLS: "Admins/Writers can manage secrets"
        # Since we use scoped client, RLS handles verification.
        data = client.table("secrets").insert({
            "vault_id": secret.vault_id,
            "key": secret.key,
            "value_encrypted": encryption_result['value'],
            "encrypted_key": encryption_result['key'],
            "created_by": user.id
        }).execute()
        
        created = data.data[0]
        
        # Log Audit
        # We need team_id. Fetch vault to get team_id? 
        # For efficiency, we might skip team_id or fetch it. 
        # Let's fetch vault info quickly or assume we modify frontend to pass it? Passing it is insecure.
        # Let's query vault
        vault_res = client.table("vaults").select("team_id, name").eq("id", secret.vault_id).execute()
        if vault_res.data:
            vault_info = vault_res.data[0]
            log_audit_event(
                client=client,
                action="CREATED",
                description=f"Added secret {secret.key} to vault {vault_info['name']}",
                team_id=vault_info['team_id'],
                resource_id=secret.vault_id,
                resource_type="vault",
                actor_id=user.id,
                actor_name=user.email.split('@')[0],
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            
        return {
            "id": created['id'],
            "key": created['key'],
            "value": secret.value, # Return raw value conform confirmation
            "version": created['version']
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vaults/{vault_id}/secrets")
def get_secrets(vault_id: str, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        # RLS: "Members can view secrets"
        response = client.table("secrets").select("id, key, version, updated_at").eq("vault_id", vault_id).execute()
        
        # We don't return values here anymore for security
        results = []
        for row in response.data:
            results.append({
                "id": row['id'],
                "key": row['key'],
                "value": None, # Masked by default
                "version": row['version'],
                "updated_at": row.get('updated_at')
            })
        
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/secrets/{secret_id}/reveal")
@limiter.limit("10/minute")
def reveal_secret(secret_id: str, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # Fetch specific secret
        response = client.table("secrets").select("*").eq("id", secret_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Secret not found")
            
        secret = response.data[0]
        
        try:
            decrypted = decrypt_value(secret['value_encrypted'], secret['encrypted_key'])
        except Exception:
            raise HTTPException(status_code=500, detail="Decryption failed")
            
        # Log Audit (Granular logging for reveals)
        # Fetch vault info for context
        vault_res = client.table("vaults").select("team_id, name").eq("id", secret['vault_id']).execute()
        if vault_res.data:
            vault_info = vault_res.data[0]
            log_audit_event(
                client=client,
                action="REVEALED",
                description=f"Revealed secret {secret['key']}",
                team_id=vault_info['team_id'],
                resource_id=secret_id,
                resource_type="secret",
                actor_id=user.id,
                actor_name=user.email.split('@')[0],
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            
        return {
            "id": secret['id'],
            "value": decrypted
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/secrets/{secret_id}")
def delete_secret(secret_id: str, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # Get info before delete for audit
        res = client.table("secrets").select("vault_id, key").eq("id", secret_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Secret not found")
        secret_info = res.data[0]
        
        # Delete
        client.table("secrets").delete().eq("id", secret_id).execute()
        
        # Audit
        vault_res = client.table("vaults").select("team_id, name").eq("id", secret_info['vault_id']).execute()
        if vault_res.data:
            vault_info = vault_res.data[0]
            log_audit_event(
                client=client,
                action="DELETED",
                description=f"Deleted secret {secret_info['key']}",
                team_id=vault_info['team_id'],
                resource_id=secret_id,
                resource_type="secret",
                actor_id=user.id,
                actor_name=user.email.split('@')[0],
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class SecretUpdate(BaseModel):
    key: str | None = None
    value: str | None = None

@router.patch("/secrets/{secret_id}")
def update_secret(secret_id: str, update: SecretUpdate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    
    updates = {}
    if update.key is not None:
        updates['key'] = update.key
    if update.value is not None:
        try:
            enc_res = encrypt_value(update.value)
            updates['value_encrypted'] = enc_res['value']
            updates['encrypted_key'] = enc_res['key']
        except Exception:
             raise HTTPException(status_code=500, detail="Encryption failed")

    if not updates:
        return {"message": "No changes"}

    try:
        # Increment version
        # We can't easily increment atomically in one call here without a stored proc or fetch-update?
        # Supabase/Postgres doesn't support "version = version + 1" in simple JS client update easily?
        # Actually it doesn't. We'll fetch first or trust user? Fetch first is safer.
        
        current = client.table("secrets").select("version, vault_id, key").eq("id", secret_id).execute()
        if not current.data:
             raise HTTPException(status_code=404, detail="Secret not found")
        
        current_data = current.data[0]
        updates['version'] = current_data['version'] + 1
        
        response = client.table("secrets").update(updates).eq("id", secret_id).execute()
        
        if not response.data:
             raise HTTPException(status_code=403, detail="Update failed: Secret not found or permission denied")

        updated_row = response.data[0]
        
        # Audit
        vault_res = client.table("vaults").select("team_id, name").eq("id", current_data['vault_id']).execute()
        if vault_res.data:
            vault_info = vault_res.data[0]
            desc = f"Updated secret {current_data['key']}"
            if update.key and update.key != current_data['key']:
                desc += f" (renamed to {update.key})"
            
            log_audit_event(
                client=client,
                action="UPDATED",
                description=desc,
                team_id=vault_info['team_id'],
                resource_id=secret_id,
                resource_type="secret",
                actor_id=user.id,
                actor_name=user.email.split('@')[0],
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )

        return {
            "id": updated_row['id'],
            "key": updated_row['key'],
            "value": update.value, # Return the value passed in (since it's decrypted from caller perspective)
            "version": updated_row['version']
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/service/vaults/{vault_identifier}/secrets")
@limiter.limit("60/minute")
def fetch_secrets_external(
    vault_identifier: str, 
    request: Request, 
    service_token: dict = Depends(get_valid_service_token)
):
    """
    Fetch secrets for a vault using a Service Token.
    vault_identifier can be a Vault ID or partial Name (e.g. 'prod').
    Authentication is handled by get_valid_service_token dependency.
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="DB unavailable")
    
    # Use Admin client to bypass RLS since Service Tokens are trusted machine access
    client = supabase_admin if supabase_admin else supabase

    # 2. Find Vault
    # Try ID first
    try:
        vault_res = client.table("vaults").select("*").eq("id", vault_identifier).eq("team_id", service_token['team_id']).execute()
    except:
        vault_res = None
        
    if not vault_res or not vault_res.data:
        # Try Name search
        vault_res = client.table("vaults")\
            .select("*")\
            .eq("team_id", service_token['team_id'])\
            .ilike("name", f"%{vault_identifier}%")\
            .execute()
            
    if not vault_res.data:
        raise HTTPException(status_code=404, detail=f"Vault '{vault_identifier}' not found in your team")
    
    target_vault = vault_res.data[0]
    
    # 3. Check Token Scope
    # If scope is READ_ONLY or READ_WRITE or ADMIN, we allow read.
    # Future: IF scope is WRITE_ONLY, deny.
    
    # 4. Fetch & Decrypt
    secrets_res = client.table("secrets").select("*").eq("vault_id", target_vault['id']).execute()
    
    out = {}
    for row in secrets_res.data:
        try:
            val = decrypt_value(row['value_encrypted'], row.get('encrypted_key'))
            out[row['key']] = val
        except Exception as e:
             out[row['key']] = f"ERROR: Decryption failed - {str(e)}"
            
    # Log Audit for Machine Access
    try:
        log_audit_event(
            client=client,
            action="REVEALED",
            description=f"Fetched secrets for vault {target_vault['name']} via Service Token",
            team_id=service_token['team_id'],
            resource_id=target_vault['id'],
            resource_type="vault",
            actor_id=None, # No user ID for tokens
            actor_name=service_token['name'],
            actor_type="bot",
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent"),
            metadata={"token_id": service_token['id']}
        )
    except Exception as e:
        print(f"Failed to log audit for bot: {e}")

    return out
