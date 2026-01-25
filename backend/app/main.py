from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, secrets, tokens, audit # Added audit

app = FastAPI(title="Envrypt API")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",  # Vite dev server IP
    "https://envrypt-seven.vercel.app",  # Production frontend domain
]
# Add production domain if configured
# if settings.FRONTEND_URL:
#     origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "Envrypt Backend"}

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(secrets.router, prefix="/api", tags=["secrets"])
app.include_router(tokens.router, prefix="/api", tags=["tokens"])
app.include_router(audit.router, prefix="/api", tags=["audit"]) # Added audit router
