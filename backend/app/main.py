from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os

from app.config import settings
from app.utils.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, items, matches, upload

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="Campus Lost & Found API",
    description="RESTful API for Campus Lost & Found Portal",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    try:
        await connect_to_mongo()
    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {e}")
        print("🚀 Application started (database connection unavailable - running in demo mode)")
    else:
        print("🚀 Application started successfully")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    print("👋 Application shutdown complete")


# Include routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(matches.router)
app.include_router(upload.router)


# Mount static files for uploads
if os.path.exists(settings.upload_dir):
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Campus Lost & Found API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "status": "operational"
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors"""
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if settings.secret_key == "your-secret-key-change-in-production" else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
