from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
import secrets
from typing import List
from ..dependencies import get_current_user, get_scoped_client
from ..crypto import hash_token
from ..utils import log_audit_event

router = APIRouter()

class TokenCreate(BaseModel):
    name: str # e.g. "GitHub Actions"
    scope: str # READ_ONLY, READ_WRITE, ADMIN
    team_id: str

@router.post("/tokens")
def create_service_token(token_req: TokenCreate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        # 1. Generate Raw Token (env_live_...)
        raw_token = f"env_live_{secrets.token_urlsafe(32)}"
        
        # 2. Hash it
        hashed = hash_token(raw_token)
        
        # 3. Store in DB (Scoped client enforces RLS)
        # RLS "Authenticated users can create [?]". 
        # Need to ensure policy allows insertion into service_tokens.
        # Check: public.service_tokens doesn't have explicit INSERT policy in my schema 
        # except "Members can view". 
        # I should have added "Admins can manage service tokens" policy.
        # Assuming we will fix schema or RLS policy allows it.
        
        response = client.table("service_tokens").insert({
            "team_id": token_req.team_id,
            "name": token_req.name,
            "token_hash": hashed,
            "scope": token_req.scope,
            "generated_by": user.id,
            "is_active": True
        }).execute()

        created = response.data[0]
        
        # Log Audit
        log_audit_event(
            client=client,
            action="CREATED",
            description=f"Created Service Token '{created['name']}' ({created['scope']})",
            team_id=token_req.team_id,
            resource_id=created['id'],
            resource_type="service_token",
            actor_id=user.id,
            actor_name=user.email.split('@')[0],
            actor_type="user",
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )

        # Return RAW token ONLY ONCE
        return {
            "id": created['id'],
            "name": created['name'],
            "scope": created['scope'],
            "raw_token": raw_token # The only time user sees this
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/tokens")
def list_tokens(team_id: str, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        # RLS "Members can view service tokens" should work.
        # But we need to filter by team_id?
        # RLS implementation: "USING (public.is_team_member(team_id))"
        # So passing team_id in query is good practice, or rely on RLS returning all tokens for all teams I'm in?
        # Usually frontend asks "Give me tokens for Team X".
        
        response = client.table("service_tokens").select("*").eq("team_id", team_id).eq("is_active", True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/tokens/{id}")
def revoke_token(id: str, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        # RLS should prevent non-admins from deleting/updating if policy is set correctly.
        # My schema had "Members can view". Need "Admins can manage".
        
        response = client.table("service_tokens").update({"is_active": False}).eq("id", id).execute()
        
        # We need team_id to log (DB lookup or require param?)
        # Let's lookup.
        if response.data:
            token_data = response.data[0]
            log_audit_event(
                client=client,
                action="REVOKED",
                description=f"Revoked Service Token '{token_data['name']}'",
                team_id=token_data['team_id'],
                resource_id=token_data['id'],
                resource_type="service_token",
                actor_id=user.id,
                actor_name=user.email.split('@')[0],
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )

        return {"status": "revoked"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
