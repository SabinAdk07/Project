from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, UserResponse, Token, PasswordResetRequest
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user, sanitize_input
from app.utils.database import get_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    users_collection = get_collection("users")
    
    # Sanitize inputs
    email = sanitize_input(user_data.email.lower())
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "email": email,
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": email, "user_id": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": email,
            "full_name": user_data.full_name
        }
    }


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    users_collection = get_collection("users")
    
    # Find user by email
    email = sanitize_input(credentials.email.lower())
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": email, "user_id": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user["email"],
            "full_name": user.get("full_name")
        }
    }


@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    """Send password reset email (mock implementation)"""
    users_collection = get_collection("users")
    
    email = sanitize_input(request.email.lower())
    user = await users_collection.find_one({"email": email})
    
    # Always return success to prevent email enumeration
    return {
        "message": "If the email exists, a password reset link has been sent",
        "success": True
    }


@router.get("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify JWT token and return user info"""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name")
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user["_id"] = str(user["_id"])
    return user
