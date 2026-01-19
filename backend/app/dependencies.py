from fastapi import Header, HTTPException, Depends
from supabase import create_client, Client
from .config import settings
from .crypto import hash_token

# Initialize Supabase Client
# We use the anon public key for basic operations, but for backend admin tasks we might need SERVICE_ROLE_KEY if we want to bypass RLS.
# However, for `verify_user`, standard key is fine as we pass the JWT.
if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
    print("Warning: Supabase credentials not set in environment.")

try:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
except:
    supabase = None

# Admin client with Service Role Key (Bypasses RLS)
try:
    if settings.SUPABASE_SERVICE_ROLE_KEY:
        supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    else:
        supabase_admin = None
except:
    supabase_admin = None

class MockUser:
    def __init__(self, id, email):
        self.id = id
        self.email = email

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
        
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
        
    token = authorization.split(" ")[1]
    
    if not supabase:
        # Mock for dev if no creds
        return MockUser(id="mock_user_id", email="mock@example.com")

    try:
        # Supabase client 'get_user' verifies the JWT
        response = supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return response.user
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

async def get_service_token_header(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    if not authorization.startswith("Bearer "):
         raise HTTPException(status_code=401, detail="Invalid token format")
    return authorization.split(" ")[1]

async def get_valid_service_token(token: str = Depends(get_service_token_header)):
    """
    Validates a service token and returns the token record.
    Checks: Format, Existence, isActive status.
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="DB unavailable")

    hashed = hash_token(token)
    
    try:
        # Use admin client to bypass RLS and find the token
        target_client = supabase_admin if supabase_admin else supabase
        
        response = target_client.table("service_tokens").select("*").eq("token_hash", hashed).limit(1).execute()
        
        if not response.data:
            raise HTTPException(status_code=401, detail="Invalid Service Token")
            
        token_record = response.data[0]
        
        if not token_record.get('is_active'):
             raise HTTPException(status_code=401, detail="Service Token has been revoked")
             
        return token_record

    except HTTPException:
        raise
    except Exception as e:
        print(f"Token validation error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

def get_scoped_client(authorization: str = Header(None)) -> Client:
    """
    Creates a Supabase client scoped to the authenticated user's token.
    This ensures all queries respect RLS policies for that user.
    """
    if not authorization or not authorization.startswith("Bearer "):
        # Should be caught by get_current_user but safety first
        raise HTTPException(status_code=401, detail="Invalid Authorization")
        
    token = authorization.split(" ")[1]
    
    # Create standard client
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    
    # Inject token into Postgrest headers for RLS
    # This allows Supabase to see the request as coming from the user (auth.uid())
    client.postgrest.auth(token)
    
    # Debug logging
    # print(f"Token passed to auth: {token[:10]}...")
    # print(f"Scoped Client Headers before: {client.postgrest.headers}")
    
    return client
