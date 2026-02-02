from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    """User creation model"""
    password: str


class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """User response model"""
    id: str = Field(alias="_id")
    created_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class UserInDB(UserBase):
    """User database model"""
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str = "bearer"
    user: dict


class PasswordResetRequest(BaseModel):
    """Password reset request model"""
    email: EmailStr
