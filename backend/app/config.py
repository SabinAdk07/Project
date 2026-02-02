from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "campus_lost_found"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Cloudinary (Optional)
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    
    # File Upload
    upload_dir: str = "./uploads"
    max_file_size: int = 5242880  # 5MB
    allowed_extensions: str = "jpg,jpeg,png,gif"  # Changed to string, will split later
    
    # CORS
    frontend_url: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def get_allowed_extensions(self) -> List[str]:
        """Get allowed extensions as a list"""
        return [ext.strip() for ext in self.allowed_extensions.split(",")]


settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.upload_dir, exist_ok=True)
