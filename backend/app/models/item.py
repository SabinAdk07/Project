from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from enum import Enum


class ItemStatus(str, Enum):
    """Item status enum"""
    LOST = "lost"
    FOUND = "found"
    CLAIMED = "claimed"
    RETURNED = "returned"


class ItemCategory(str, Enum):
    """Item category enum"""
    ELECTRONICS = "electronics"
    BOOKS = "books"
    CLOTHING = "clothing"
    ACCESSORIES = "accessories"
    DOCUMENTS = "documents"
    KEYS = "keys"
    BAGS = "bags"
    SPORTS = "sports"
    OTHER = "other"


class ItemBase(BaseModel):
    """Base item model"""
    name: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10, max_length=1000)
    category: ItemCategory
    status: ItemStatus
    location: str = Field(..., min_length=3, max_length=200)
    date: datetime = Field(default_factory=datetime.utcnow)
    images: List[str] = Field(default_factory=list)
    contact_info: Optional[str] = None


class ItemCreate(ItemBase):
    """Item creation model"""
    pass


class ItemUpdate(BaseModel):
    """Item update model"""
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    category: Optional[ItemCategory] = None
    status: Optional[ItemStatus] = None
    location: Optional[str] = Field(None, min_length=3, max_length=200)
    date: Optional[datetime] = None
    images: Optional[List[str]] = None
    contact_info: Optional[str] = None


class ItemResponse(ItemBase):
    """Item response model"""
    id: str = Field(alias="_id")
    user_id: str
    user_email: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class ItemInDB(ItemBase):
    """Item database model"""
    user_id: str
    user_email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ItemSearchQuery(BaseModel):
    """Item search query model"""
    query: Optional[str] = None
    category: Optional[ItemCategory] = None
    status: Optional[ItemStatus] = None
    location: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=12, ge=1, le=100)


class MatchRequest(BaseModel):
    """Match request model for finding similar items"""
    name: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10, max_length=1000)
    category: ItemCategory
    location: Optional[str] = None
    date: Optional[datetime] = None
