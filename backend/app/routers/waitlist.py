from typing import Optional
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, EmailStr
from ..dependencies import supabase, supabase_admin
from ..limiter import limiter

router = APIRouter()

class WaitlistEntry(BaseModel):
    email: EmailStr
    team_size: Optional[str] = None
    current_tool: Optional[str] = None
    current_tool_other: Optional[str] = None
    referral_source: Optional[str] = None

@router.post("/waitlist")
@limiter.limit("5/minute")
async def join_waitlist(entry: WaitlistEntry, request: Request):
    # Use admin client to bypass any RLS on insert if necessary, 
    # but strictly speaking anon key should be able to insert if RLS allows it.
    # To be safe and avoid opening public insert to anon, we'll use admin here 
    # and not enable RLS public insert policy, effectively making it a backend-only operation.
    
    client = supabase_admin if supabase_admin else supabase
    if not client:
        raise HTTPException(status_code=503, detail="Database Service Unavailable")

    try:
        # Check if email already exists
        existing = client.table("waitlist").select("id").eq("email", entry.email).execute()
        if existing.data:
            return {"message": "You are already on the waitlist!"}

        # Insert
        response = client.table("waitlist").insert({
            "email": entry.email,
            "team_size": entry.team_size,
            "current_tool": entry.current_tool,
            "current_tool_other": entry.current_tool_other,
            "referral_source": entry.referral_source
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to join waitlist")
            
        return {"message": "Successfully joined the waitlist!", "status": "success"}

    except Exception as e:
        # Log the error internally
        print(f"Waitlist error: {str(e)}")
        raise HTTPException(status_code=400, detail="Could not process request")
