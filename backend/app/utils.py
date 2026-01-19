from typing import Optional, Dict, Any
from fastapi import Request
from .dependencies import supabase, supabase_admin

# This helper function uses the provided client, OR prefers the supabase_admin client 
# if available to ensure logs are written regardless of RLS policies for the user.

def log_audit_event(
    client, 
    action: str, 
    description: str, 
    team_id: str,
    resource_id: str,
    resource_type: str,
    actor_id: str = None, 
    actor_name: str = "Unknown", 
    actor_type: str = "user", 
    ip_address: str = None,
    user_agent: str = None,
    metadata: Dict[str, Any] = {}
):
    # Prefer admin client to bypass RLS for audit logs
    target_client = supabase_admin if supabase_admin else client

    try:
        # Construct the detailed metadata blob
        # We store the "snapshot" of actor details here because the core table 
        # only has foreign keys which might change or be deleted.
        enriched_metadata = {
            **metadata,
            "actor_name": actor_name,
            "actor_type": actor_type,
            "description": description,
            "ip_address": ip_address,
            "user_agent": user_agent
        }

        data = {
            "team_id": team_id,
            "actor_id": actor_id,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "metadata": enriched_metadata
        }
        
        target_client.table("audit_logs").insert(data).execute()
    except Exception as e:
        print(f"FAILED TO LOG AUDIT EVENT: {e}")

