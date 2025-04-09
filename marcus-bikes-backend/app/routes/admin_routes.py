from typing import Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import os
from datetime import datetime, timedelta
import jwt

router = APIRouter(prefix="/admin", tags=["admin"])

# Simple security scheme for admin authentication
security = HTTPBearer()

# Environment variables for JWT settings
# In a real application, these would be in .env file
ADMIN_SECRET_KEY = os.environ.get("ADMIN_SECRET_KEY", "very-secret-key-for-admin-only")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "marcus")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "bike-shop-owner")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8 hours

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime

def admin_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify the admin token.
    """
    try:
        payload = jwt.decode(credentials.credentials, ADMIN_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(login_request: AdminLoginRequest):
    """
    Authenticate as admin.
    """
    if login_request.username != ADMIN_USERNAME or login_request.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_at = datetime.utcnow() + access_token_expires
    
    # Create access token
    payload = {
        "sub": login_request.username,
        "exp": expires_at
    }
    access_token = jwt.encode(payload, ADMIN_SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at
    }

@router.get("/verify")
def verify_admin(username: str = Depends(admin_auth)):
    """
    Verify admin credentials and return admin username.
    """
    return {"admin": username, "authenticated": True} 