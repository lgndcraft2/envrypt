from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from ..dependencies import get_current_user, get_scoped_client, supabase, supabase_admin
from ..utils import log_audit_event

router = APIRouter()

class TeamCreate(BaseModel):
    name: str
    slug: str

class TeamJoin(BaseModel):
    code: str

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    
# Response model for members
class TeamMember(BaseModel):
    user_id: str
    role: str
    joined_at: str
    email: Optional[str] = None
    name: Optional[str] = None

@router.post("/teams")
def create_team(team: TeamCreate, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    """
    Create a new team.
    The database trigger 'on_team_created' will automatically add the
    current user as the OWNER of the new team.
    """
    try:
        # Using scoped client, RLS checks auth.uid()
        response = client.table("teams").insert({
            "name": team.name, 
            "slug": team.slug
        }).execute()
        
        if len(response.data) > 0:
            new_team = response.data[0]
            # Log Audit
            log_audit_event(
                client=client,
                action="CREATED",
                description=f"Created team {new_team['name']}",
                team_id=new_team['id'],
                resource_id=new_team['id'],
                resource_type="team",
                actor_id=user.id,
                actor_name=user.email.split('@')[0],
                actor_type="user",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            return new_team
        raise HTTPException(status_code=400, detail="Failed to create team")
        
    except Exception as e:
        print(f"Error creating team: {e}")
        if "duplicate key" in str(e):
             raise HTTPException(status_code=409, detail="Team URL already exists")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/teams/join")
def join_team(invite: TeamJoin, request: Request, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    """
    Join a team by invite code or ID.
    For MVP: We treat the 'code' as the Team ID or Team Name.
    Ideally this would be a separate invite_codes table.
    """
    try:
        # 1. Find Team
        # Security: User can join if they know the UUID.
        # Use global supabase client to bypass RLS if configured with Service Key, 
        # or at least avoid specificity of the user's empty membership list.
        team_res = supabase.table("teams").select("id, name").eq("id", invite.code).execute()
        
        if not team_res.data:
             raise HTTPException(status_code=404, detail="Invalid invite code")
             
        team = team_res.data[0]
        
        # 2. Add Member
        # RLS Policy 'Authenticated users can create team_members'? 
        # No, usually only Admins invoke this or it's an invite system.
        # Our SQL schema: 
        # public.team_members
        # No specific INSERT policy for members unless owner adds them.
        # IF we want "Join by Code" to work, we need a policy allowing users to insert THEMSELVES if they know ID.
        # Current Schema Policy: "Members can view team members".
        # Missed "Users can join teams".
        # We might need to bypass RLS here or add a specific policy.
        
        # FOR MVP: We will assume we can insert if authenticated.
        # If RLS fails, we might need a stored procedure or admin client.
        
        member_res = client.table("team_members").insert({
            "team_id": team['id'],
            "user_id": user.id,
            "role": "MEMBER"
        }).execute()
        
        # Log Audit
        log_audit_event(
            client=client,
            action="JOINED",
            description=f"User joined team via invite code",
            team_id=team['id'],
            resource_id=team['id'],
            resource_type="team",
            actor_id=user.id,
            actor_name=user.email.split('@')[0],
            actor_type="user",
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )

        return {"status": "joined", "team": team}

    except Exception as e:
        if "duplicate key" in str(e):
            raise HTTPException(status_code=409, detail="Already a member")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/teams")
def get_my_teams(user = Depends(get_current_user), client = Depends(get_scoped_client)):
    """
    Fetch teams the current user is a member of.
    """
    try:
        # Query team_members to find teams the user belongs to
        # We use the alias 'team:teams' to fetch the joined team data
        response = client.table("team_members").select("role, team:teams(*)").eq("user_id", user.id).execute()
        
        teams = []
        for record in response.data:
            if record.get("team"):
                team_data = record["team"]
                # Inject the role into the team object for frontend context
                team_data["role"] = record["role"]
                teams.append(team_data)
                
        return teams
    except Exception as e:
        print(f"Error fetching teams: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/teams/{team_id}")
def update_team(team_id: str, update: TeamUpdate, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        # RLS should handle permission check (Owner only?)
        # Ideally: CREATE POLICY "Owners can update team" ...
        data = {}
        if update.name:
            data["name"] = update.name
            
        if not data:
            return {"status": "no change"}
            
        response = client.table("teams").update(data).eq("id", team_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/teams/{team_id}/members")
def get_team_members(team_id: str, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        # Check membership first (RLS handles this for table queries, but we are enriching)
        response = client.table("team_members").select("*").eq("team_id", team_id).execute()
        members = response.data
        
        # Enrich with user details if admin client is available
        enriched_members = []
        for m in members:
            email = "hidden@example.com"
            name = "Unknown"
            
            if m['user_id'] == user.id:
                 email = user.email
                 # name = user.user_metadata.get('full_name', 'You')
            
            if supabase_admin:
                try:
                    # In newer supabase-py versions, it might be supabase_admin.auth.admin.get_user_by_id
                    # Checking the library version is hard, so we wrap in try/except 
                    u = supabase_admin.auth.admin.get_user_by_id(m['user_id'])
                    if u and u.user:
                        email = u.user.email
                except:
                    pass
            
            enriched_members.append({
                "user_id": m['user_id'],
                "role": m.get('role', 'Member'),
                "joined_at": m.get('created_at', ''),
                "email": email,
                "name": email.split('@')[0] if email else "Unknown" # Simple heuristic
            })
            
        return enriched_members
    except Exception as e:
        print(f"Error fetching members: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/teams/{team_id}/members/{user_id}")
def remove_member(team_id: str, user_id: str, user = Depends(get_current_user), client = Depends(get_scoped_client)):
    try:
        # Only owners/admins should do this. RLS policy needed.
        # Assuming RLS: "Admins can delete team_members"
        
        response = client.table("team_members").delete().eq("team_id", team_id).eq("user_id", user_id).execute()
        return {"status": "removed"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
