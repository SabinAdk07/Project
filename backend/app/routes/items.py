from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.item import (
    ItemCreate, ItemUpdate, ItemResponse, ItemSearchQuery, 
    ItemStatus, ItemCategory, ItemInDB
)
from app.utils.security import get_current_user, sanitize_input
from app.utils.database import get_collection
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
import math

router = APIRouter(prefix="/api/items", tags=["Items"])


@router.get("", response_model=dict)
async def get_items(
    query: Optional[str] = Query(None),
    category: Optional[ItemCategory] = Query(None),
    status: Optional[ItemStatus] = Query(None),
    location: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100)
):
    """Get all items with optional filters and pagination"""
    items_collection = get_collection("items")
    
    # Build filter query
    filter_query = {}
    
    if query:
        sanitized_query = sanitize_input(query)
        filter_query["$or"] = [
            {"name": {"$regex": sanitized_query, "$options": "i"}},
            {"description": {"$regex": sanitized_query, "$options": "i"}}
        ]
    
    if category:
        filter_query["category"] = category
    
    if status:
        filter_query["status"] = status
    
    if location:
        filter_query["location"] = {"$regex": sanitize_input(location), "$options": "i"}
    
    # Calculate pagination
    skip = (page - 1) * limit
    
    # Get total count
    total = await items_collection.count_documents(filter_query)
    
    # Get items
    cursor = items_collection.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
    items = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for item in items:
        item["_id"] = str(item["_id"])
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": math.ceil(total / limit) if total > 0 else 0
    }


@router.get("/stats")
async def get_stats():
    """Get statistics about items"""
    items_collection = get_collection("items")
    
    total_items = await items_collection.count_documents({})
    lost_items = await items_collection.count_documents({"status": ItemStatus.LOST})
    found_items = await items_collection.count_documents({"status": ItemStatus.FOUND})
    claimed_items = await items_collection.count_documents({"status": ItemStatus.CLAIMED})
    
    return {
        "total": total_items,
        "lost": lost_items,
        "found": found_items,
        "claimed": claimed_items
    }


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str):
    """Get a specific item by ID"""
    items_collection = get_collection("items")
    
    if not ObjectId.is_valid(item_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid item ID"
        )
    
    item = await items_collection.find_one({"_id": ObjectId(item_id)})
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    item["_id"] = str(item["_id"])
    return item


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    item_data: ItemCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new item (requires authentication)"""
    items_collection = get_collection("items")
    
    # Sanitize inputs
    item_doc = {
        "name": sanitize_input(item_data.name),
        "description": sanitize_input(item_data.description),
        "category": item_data.category,
        "status": item_data.status,
        "location": sanitize_input(item_data.location),
        "date": item_data.date,
        "images": item_data.images,
        "contact_info": sanitize_input(item_data.contact_info) if item_data.contact_info else None,
        "user_id": current_user["user_id"],
        "user_email": current_user["email"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await items_collection.insert_one(item_doc)
    item_doc["_id"] = str(result.inserted_id)
    
    return item_doc


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: str,
    item_data: ItemUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an item (only by owner or when claiming)"""
    items_collection = get_collection("items")
    
    if not ObjectId.is_valid(item_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid item ID"
        )
    
    # Find item
    item = await items_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Check if user is owner (for full updates) or claiming (status change only)
    is_owner = item["user_id"] == current_user["user_id"]
    is_claiming = item_data.status in [ItemStatus.CLAIMED, ItemStatus.RETURNED] and not is_owner
    
    if not is_owner and not is_claiming:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this item"
        )
    
    # Build update document
    update_doc = {}
    if item_data.name and is_owner:
        update_doc["name"] = sanitize_input(item_data.name)
    if item_data.description and is_owner:
        update_doc["description"] = sanitize_input(item_data.description)
    if item_data.category and is_owner:
        update_doc["category"] = item_data.category
    if item_data.status:
        update_doc["status"] = item_data.status
    if item_data.location and is_owner:
        update_doc["location"] = sanitize_input(item_data.location)
    if item_data.date and is_owner:
        update_doc["date"] = item_data.date
    if item_data.images is not None and is_owner:
        update_doc["images"] = item_data.images
    if item_data.contact_info is not None and is_owner:
        update_doc["contact_info"] = sanitize_input(item_data.contact_info)
    
    update_doc["updated_at"] = datetime.utcnow()
    
    # Update item
    await items_collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": update_doc}
    )
    
    # Get updated item
    updated_item = await items_collection.find_one({"_id": ObjectId(item_id)})
    updated_item["_id"] = str(updated_item["_id"])
    
    return updated_item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an item (only by owner)"""
    items_collection = get_collection("items")
    
    if not ObjectId.is_valid(item_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid item ID"
        )
    
    # Find item
    item = await items_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Check if user is owner
    if item["user_id"] != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item"
        )
    
    # Delete item
    await items_collection.delete_one({"_id": ObjectId(item_id)})
    
    return None


@router.get("/user/my-items", response_model=List[ItemResponse])
async def get_my_items(current_user: dict = Depends(get_current_user)):
    """Get items posted by current user"""
    items_collection = get_collection("items")
    
    cursor = items_collection.find({"user_id": current_user["user_id"]}).sort("created_at", -1)
    items = await cursor.to_list(length=None)
    
    for item in items:
        item["_id"] = str(item["_id"])
    
    return items
