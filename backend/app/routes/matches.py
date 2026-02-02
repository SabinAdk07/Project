from fastapi import APIRouter, Depends, HTTPException, status
from app.models.item import MatchRequest, ItemResponse, ItemStatus
from app.utils.security import get_current_user
from app.utils.database import get_collection
from typing import List
from difflib import SequenceMatcher

router = APIRouter(prefix="/api/matches", tags=["Matches"])


def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()


def get_keyword_matches(description: str, keywords: List[str]) -> int:
    """Count how many keywords appear in description"""
    description_lower = description.lower()
    return sum(1 for keyword in keywords if keyword.lower() in description_lower)


@router.post("", response_model=List[ItemResponse])
async def find_matches(
    match_request: MatchRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Find matching items based on description, category, and location
    Returns items with similarity scores
    """
    items_collection = get_collection("items")
    
    # Determine opposite status (if looking for lost, search in found and vice versa)
    if match_request.category:
        # Find items in opposite status with same category
        opposite_status = ItemStatus.FOUND if "lost" in str(match_request).lower() else ItemStatus.LOST
        
        filter_query = {
            "category": match_request.category,
            "status": {"$in": [ItemStatus.FOUND, ItemStatus.LOST]}
        }
    else:
        filter_query = {"status": {"$in": [ItemStatus.FOUND, ItemStatus.LOST]}}
    
    # Get all potential matches
    cursor = items_collection.find(filter_query)
    all_items = await cursor.to_list(length=None)
    
    # Extract keywords from request description
    keywords = [word for word in match_request.description.split() if len(word) > 3]
    
    # Calculate similarity scores
    scored_items = []
    for item in all_items:
        # Calculate name similarity
        name_similarity = calculate_similarity(match_request.name, item["name"])
        
        # Calculate description similarity
        desc_similarity = calculate_similarity(match_request.description, item["description"])
        
        # Count keyword matches
        keyword_matches = get_keyword_matches(item["description"], keywords)
        
        # Calculate location match bonus
        location_bonus = 0.0
        if match_request.location and item.get("location"):
            location_bonus = 0.2 if calculate_similarity(match_request.location, item["location"]) > 0.5 else 0.0
        
        # Calculate category match bonus
        category_bonus = 0.3 if match_request.category == item["category"] else 0.0
        
        # Calculate overall score (weighted)
        overall_score = (
            name_similarity * 0.3 +
            desc_similarity * 0.4 +
            (keyword_matches / max(len(keywords), 1)) * 0.1 +
            location_bonus +
            category_bonus
        )
        
        # Only include items with reasonable similarity
        if overall_score > 0.3:
            item["_id"] = str(item["_id"])
            item["match_score"] = round(overall_score * 100, 2)  # Convert to percentage
            scored_items.append(item)
    
    # Sort by score descending
    scored_items.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    
    # Return top 10 matches
    return scored_items[:10]


@router.get("/suggestions")
async def get_suggestions(current_user: dict = Depends(get_current_user)):
    """Get general suggestions for lost items based on recent found items"""
    items_collection = get_collection("items")
    
    # Get recent found items
    cursor = items_collection.find({"status": ItemStatus.FOUND}).sort("created_at", -1).limit(5)
    recent_found = await cursor.to_list(length=5)
    
    for item in recent_found:
        item["_id"] = str(item["_id"])
    
    return {
        "message": "Recent found items that might match your lost item",
        "items": recent_found
    }
