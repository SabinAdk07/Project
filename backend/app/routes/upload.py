from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from app.config import settings
from app.utils.security import get_current_user
from typing import List
import os
import uuid
from PIL import Image
import shutil

router = APIRouter(prefix="/api/upload", tags=["Upload"])


def validate_file(file: UploadFile) -> bool:
    """Validate file type and size"""
    # Check file extension
    file_ext = file.filename.split(".")[-1].lower()
    allowed = settings.get_allowed_extensions()
    if file_ext not in allowed:
        return False
    
    return True


def optimize_image(file_path: str, max_size: tuple = (1200, 1200)):
    """Optimize and resize image"""
    try:
        with Image.open(file_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize if larger than max_size
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save optimized image
            img.save(file_path, "JPEG", quality=85, optimize=True)
    except Exception as e:
        print(f"Error optimizing image: {e}")


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a single file"""
    
    # Validate file
    if not validate_file(file):
        allowed = settings.get_allowed_extensions()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(allowed)}"
        )
    
    # Generate unique filename
    file_ext = file.filename.split(".")[-1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(settings.upload_dir, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Optimize image
        optimize_image(file_path)
        
        # Return file URL (adjust based on your server setup)
        file_url = f"/uploads/{unique_filename}"
        
        return {
            "success": True,
            "url": file_url,
            "filename": unique_filename
        }
    
    except Exception as e:
        # Clean up file if error occurs
        if os.path.exists(file_path):
            os.remove(file_path)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )


@router.post("/multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload multiple files"""
    
    if len(files) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 5 files allowed per upload"
        )
    
    uploaded_files = []
    
    for file in files:
        # Validate file
        if not validate_file(file):
            continue
        
        # Generate unique filename
        file_ext = file.filename.split(".")[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(settings.upload_dir, unique_filename)
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Optimize image
            optimize_image(file_path)
            
            # Add to uploaded files list
            file_url = f"/uploads/{unique_filename}"
            uploaded_files.append({
                "url": file_url,
                "filename": unique_filename
            })
        
        except Exception as e:
            # Clean up file if error occurs
            if os.path.exists(file_path):
                os.remove(file_path)
            continue
    
    if not uploaded_files:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload any files"
        )
    
    return {
        "success": True,
        "files": uploaded_files,
        "count": len(uploaded_files)
    }


@router.delete("/{filename}")
async def delete_file(
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an uploaded file"""
    
    file_path = os.path.join(settings.upload_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        os.remove(file_path)
        return {
            "success": True,
            "message": "File deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )
