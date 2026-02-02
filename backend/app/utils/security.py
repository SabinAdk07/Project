from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme for JWT
security = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency to get current user from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    user_email = payload.get("sub")
    if user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    return {"email": user_email, "user_id": payload.get("user_id")}


def sanitize_input(text: str) -> str:
    """Basic input sanitization"""
    if not text:
        return text
    # Remove potentially harmful characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '|', '`']
    for char in dangerous_chars:
        text = text.replace(char, '')
    return text.strip()
