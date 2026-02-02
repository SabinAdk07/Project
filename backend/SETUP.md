# Backend Setup Guide

This guide will help you set up the FastAPI backend for the Campus Lost & Found Portal.

## Prerequisites

- Python 3.9 or higher
- MongoDB 6.0 or higher
- pip (Python package manager)

## Step-by-Step Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install and Configure MongoDB

#### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Add a database user
5. Whitelist your IP address
6. Get your connection string
7. Update `.env` with the connection string

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cd backend
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux
```

Edit `.env` with your settings:

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=campus_lost_found

# Security
SECRET_KEY=your-very-secure-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif

# CORS
FRONTEND_URL=http://localhost:3000

# Optional: Cloudinary (for cloud storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Important**: Change `SECRET_KEY` to a secure random string in production!

Generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Verify Installation

Test if MongoDB is running:
```bash
# Windows
mongo --version

# macOS/Linux
mongosh --version
```

### 5. Run the Backend

```bash
cd backend
uvicorn app.main:app --reload
```

You should see:
```
✅ Connected to MongoDB at mongodb://localhost:27017
🚀 Application started successfully
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 6. Test the API

Open your browser and visit:
- API Root: http://localhost:8000
- API Docs: http://localhost:8000/api/docs
- Health Check: http://localhost:8000/health

## Database Setup

The application will automatically create collections when you start using it. No manual database setup required!

Collections created:
- `users` - User accounts
- `items` - Lost and found items

## Troubleshooting

### MongoDB Connection Error

**Error**: `Failed to connect to MongoDB`

**Solution**:
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mongod
   ```

2. Verify connection string in `.env`
3. Check firewall settings

### Port Already in Use

**Error**: `Address already in use`

**Solution**:
```bash
# Find process using port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

Or run on a different port:
```bash
uvicorn app.main:app --reload --port 8001
```

### Import Errors

**Error**: `ModuleNotFoundError`

**Solution**:
```bash
# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### File Upload Issues

**Error**: `Failed to upload file`

**Solution**:
1. Check if `uploads` directory exists
2. Verify file permissions
3. Check file size (max 5MB by default)
4. Ensure file extension is allowed

## Production Configuration

### Security Checklist

- [ ] Change `SECRET_KEY` to a secure random string
- [ ] Use HTTPS in production
- [ ] Configure CORS for your frontend domain
- [ ] Use MongoDB Atlas or secured MongoDB instance
- [ ] Set up rate limiting
- [ ] Enable logging
- [ ] Use environment variables for all secrets

### Environment Variables for Production

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
SECRET_KEY=<secure-random-string>
FRONTEND_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

### Running in Production

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## API Testing

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get items
curl http://localhost:8000/api/items
```

### Using Postman

1. Import the API documentation from http://localhost:8000/api/docs
2. Create a collection
3. Test endpoints with different parameters

## Monitoring and Logs

### View Logs

Logs are printed to console. To save to file:

```bash
uvicorn app.main:app --reload --log-level info > app.log 2>&1
```

### Monitor Performance

Use FastAPI's built-in metrics:
- Visit http://localhost:8000/api/docs
- Check response times for each endpoint

## Backup and Restore

### Backup MongoDB

```bash
mongodump --db campus_lost_found --out ./backup
```

### Restore MongoDB

```bash
mongorestore --db campus_lost_found ./backup/campus_lost_found
```

## Need Help?

- Check the main README.md for general information
- Visit http://localhost:8000/api/docs for API documentation
- Report issues on GitHub
- Contact support@campuslostandfound.com
