from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any
from ..dependencies import get_current_user, get_scoped_client, get_service_token_header, get_valid_service_token, supabase, supabase_admin
from ..crypto import encrypt_secret, decrypt_secret, hash_token
from ..utils import log_audit_event

router = APIRouter()

class SecretCreate(BaseModel):
    vault_id: str
    key: str
    value: str

class VaultCreate(BaseModel):
    team_id: str
    name: str

# Route to list vaults for a team with secret counts or smn shii like that
@router.get("/vaults")
def list_vaults(team_id: str, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        # Fetch vaults with secret count
        response = client.table("vaults").select("*, secrets(count)").eq("team_id", team_id).execute()
        
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
        response = client.table("vaults").insert({
            "team_id": vault.team_id,
            "name": vault.name
        }).execute()
        
        if len(response.data) > 0:
            new_vault = response.data[0]
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

@router.get("/vaults/{vault_id}")
def get_vault(vault_id: str, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        response = client.table("vaults").select("*").eq("id", vault_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Vault not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/secrets")
def create_secret(secret: SecretCreate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    if not client:
         raise HTTPException(status_code=503, detail="DB unavailable")

    # Encrypt
    try:
        encrypted_value = encrypt_secret(secret.value)
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Encryption configuration error")

    # Insert
    try:
        # RLS: "Admins/Writers can manage secrets"
        # Since we use scoped client, RLS handles verification.
        data = client.table("secrets").insert({
            "vault_id": secret.vault_id,
            "key": secret.key,
            "value_encrypted": encrypted_value,
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
        response = client.table("secrets").select("*").eq("vault_id", vault_id).execute()
        
        results = []
        for row in response.data:
            try:
                decrypted = decrypt_secret(row['value_encrypted'])
                results.append({
                    "id": row['id'],
                    "key": row['key'],
                    "value": decrypted,
                    "version": row['version'],
                    "updated_at": row['updated_at']
                })
            except Exception:
                results.append({
                    "id": row['id'],
                    "key": row['key'],
                    "value": "<DECRYPTION_ERROR>",
                    "version": row['version'],
                    "updated_at": row['updated_at']
                })
        
        # Log Access (Audit only on reveal? Or listing? Listing usually doesn't reveal values)
        # But here we REVEAL values. So we should log.
        # However, listing 50 secrets creates 50 logs? That's too much.
        # Maybe we iterate and log "Accessed Vault"?
        # For now, let's log "Accessed Vault" once.
        if results and len(results) > 0:
             # We need team_id
             vault_res = client.table("vaults").select("team_id, name").eq("id", vault_id).execute()
             if vault_res.data:
                vault_info = vault_res.data[0]
                log_audit_event(
                    client=client,
                    action="REVEALED",
                    description=f"Accessed all secrets in vault {vault_info['name']}",
                    team_id=vault_info['team_id'],
                    resource_id=vault_id,
                    resource_type="vault",
                    actor_id=user.id,
                    actor_name=user.email.split('@')[0],
                    actor_type="user",
                    ip_address=request.client.host,
                    user_agent=request.headers.get("user-agent")
                )

        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/service/vaults/{vault_identifier}/secrets")
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
            val = decrypt_secret(row['value_encrypted'])
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
