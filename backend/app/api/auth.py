"""
Authentication API routes with OAuth support
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from authlib.integrations.starlette_client import OAuthError
import httpx
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any
import uuid

from ..core.config import get_settings

router = APIRouter()
settings = get_settings()

# OAuth configuration
oauth = OAuth()

# Configure Google OAuth
oauth.register(
    name='google',
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# Configure GitHub OAuth
oauth.register(
    name='github',
    client_id=settings.github_client_id,
    client_secret=settings.github_client_secret,
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

@router.get("/google")
async def google_auth(request: Request):
    """Initiate Google OAuth flow"""
    try:
        redirect_uri = f"{request.base_url}api/auth/google/callback"
        return await oauth.google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth initialization failed: {str(e)}")

@router.get("/github")
async def github_auth(request: Request):
    """Initiate GitHub OAuth flow"""
    try:
        redirect_uri = f"{request.base_url}api/auth/github/callback"
        return await oauth.github.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth initialization failed: {str(e)}")

@router.get("/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info from Google")
        
        # Create user data
        user_data = {
            "id": f"google_{user_info['sub']}",
            "email": user_info['email'],
            "username": user_info.get('name', user_info['email'].split('@')[0]),
            "avatar": user_info.get('picture'),
            "provider": "google",
            "plan": "pro",  # Default plan for OAuth users
            "joinedAt": datetime.utcnow().isoformat()
        }
        
        # Create JWT token
        access_token = create_access_token({"sub": user_data["id"], "email": user_data["email"]})
        
        # Redirect to frontend with token
        redirect_url = f"{settings.frontend_url}/auth/success?token={access_token}&user={user_data['id']}"
        return RedirectResponse(url=redirect_url)
        
    except OAuthError as e:
        error_url = f"{settings.frontend_url}/auth/error?error=oauth_error&message={str(e)}"
        return RedirectResponse(url=error_url)
    except Exception as e:
        error_url = f"{settings.frontend_url}/auth/error?error=server_error&message={str(e)}"
        return RedirectResponse(url=error_url)

@router.get("/github/callback")
async def github_callback(request: Request):
    """Handle GitHub OAuth callback"""
    try:
        token = await oauth.github.authorize_access_token(request)
        
        # Get user info from GitHub API
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"token {token['access_token']}"}
            
            # Get user profile
            user_response = await client.get("https://api.github.com/user", headers=headers)
            user_info = user_response.json()
            
            # Get user email (if not public)
            email = user_info.get('email')
            if not email:
                email_response = await client.get("https://api.github.com/user/emails", headers=headers)
                emails = email_response.json()
                primary_email = next((e for e in emails if e['primary']), None)
                if primary_email:
                    email = primary_email['email']
        
        if not email:
            raise HTTPException(status_code=400, detail="Could not retrieve email from GitHub")
        
        # Create user data
        user_data = {
            "id": f"github_{user_info['id']}",
            "email": email,
            "username": user_info['login'],
            "avatar": user_info.get('avatar_url'),
            "provider": "github",
            "plan": "pro",  # Default plan for OAuth users
            "joinedAt": datetime.utcnow().isoformat()
        }
        
        # Create JWT token
        access_token = create_access_token({"sub": user_data["id"], "email": user_data["email"]})
        
        # Redirect to frontend with token
        redirect_url = f"{settings.frontend_url}/auth/success?token={access_token}&user={user_data['id']}"
        return RedirectResponse(url=redirect_url)
        
    except OAuthError as e:
        error_url = f"{settings.frontend_url}/auth/error?error=oauth_error&message={str(e)}"
        return RedirectResponse(url=error_url)
    except Exception as e:
        error_url = f"{settings.frontend_url}/auth/error?error=server_error&message={str(e)}"
        return RedirectResponse(url=error_url)

@router.post("/verify-token")
async def verify_token(token_data: Dict[str, str]):
    """Verify JWT token and return user data"""
    try:
        token = token_data.get("token")
        if not token:
            raise HTTPException(status_code=400, detail="Token is required")
        
        # Decode JWT token
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise HTTPException(status_code=400, detail="Invalid token payload")
        
        # Return user data (in a real app, fetch from database)
        provider = "google" if user_id.startswith("google_") else "github"
        username = email.split('@')[0] if provider == "google" else user_id.split('_')[1]
        
        user_data = {
            "id": user_id,
            "email": email,
            "username": username,
            "provider": provider,
            "plan": "pro",
            "joinedAt": datetime.utcnow().isoformat()
        }
        
        return {"user": user_data, "token": token}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")

@router.post("/logout")
async def logout():
    """Logout endpoint"""
    return {"message": "Logged out successfully"}

# Traditional login for demo purposes
@router.post("/login")
async def login(credentials: Dict[str, str]):
    """Traditional login (demo mode)"""
    username = credentials.get("username")
    password = credentials.get("password")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    # Demo user creation
    user_data = {
        "id": f"demo_{username}",
        "email": f"{username}@demo.nebulaforge.dev",
        "username": username,
        "provider": "demo",
        "plan": "pro",
        "joinedAt": datetime.utcnow().isoformat()
    }
    
    # Create JWT token
    access_token = create_access_token({"sub": user_data["id"], "email": user_data["email"]})
    
    return {"user": user_data, "token": access_token}

@router.get("/me")
async def get_current_user(token: str):
    """Get current user from token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Return user data
        provider = "google" if user_id.startswith("google_") else "github" if user_id.startswith("github_") else "demo"
        username = email.split('@')[0] if provider != "demo" else user_id.split('_')[1]
        
        user_data = {
            "id": user_id,
            "email": email,
            "username": username,
            "provider": provider,
            "plan": "pro",
            "joinedAt": datetime.utcnow().isoformat()
        }
        
        return user_data
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")