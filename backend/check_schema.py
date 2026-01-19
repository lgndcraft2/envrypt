import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_KEY:
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_structure():
    print("--- Checking Vaults Structure ---")
    try:
        res = supabase.table("vaults").select("*").limit(1).execute()
        if res.data:
            print("Vault Columns:", res.data[0].keys())
        else:
            print("No vaults found, can't check columns easily without metadata query.")
    except Exception as e:
        print(f"Error checking vaults: {e}")

    print("\n--- Checking Team Members Structure ---")
    try:
        res = supabase.table("team_members").select("*").limit(1).execute()
        if res.data:
            print("Team Member Columns:", res.data[0].keys())
    except Exception as e:
         print(f"Error checking members: {e}")

if __name__ == "__main__":
    check_structure()
