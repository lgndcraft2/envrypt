from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta
from ..dependencies import get_current_user, get_scoped_client

router = APIRouter()

@router.get("/audit-logs")
def get_audit_logs(
    team_id: str, 
    action: Optional[str] = None,
    limit: int = 100,
    user = Depends(get_current_user), 
    client = Depends(get_scoped_client)
):
    try:
        # Fetch logs for the team
        # Assuming the RLS policy filters by team membership or we filter manually
        query = client.table("audit_logs").select("*").eq("team_id", team_id)
        
        if action and action != "All":
            query = query.eq("action", action)

        # Order by newest first
        response = query.order("created_at", desc=True).limit(limit).execute()
        
        # Flatten the metadata fields for the frontend
        logs = []
        for log in response.data:
            meta = log.get("metadata", {}) or {}
            logs.append({
                "id": log["id"],
                "created_at": log["created_at"],
                "action": log["action"],
                "team_id": log["team_id"],
                "actor_id": log["actor_id"],
                # Lift fields from metadata, with defaults
                "actor_name": meta.get("actor_name", "Unknown"),
                "actor_type": meta.get("actor_type", "user"),
                "description": meta.get("description", ""),
                "ip_address": meta.get("ip_address"),
                "user_agent": meta.get("user_agent"),
                # Keep raw metadata available too
                "metadata": meta
            })

        return logs
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
