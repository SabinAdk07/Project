# Quick Start Guide

Welcome to Campus Lost & Found Portal! This guide will get you up and running in 5 minutes.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.9+ installed (`python --version`)
- ✅ Node.js 18+ installed (`node --version`)
- ✅ MongoDB 6.0+ installed or MongoDB Atlas account
- ✅ Git installed (`git --version`)

## 🚀 Quick Setup (5 Minutes)

### Step 1: Clone or Navigate to Project

```bash
cd e:\Hackathon
```

### Step 2: Backend Setup (2 minutes)

```bash
# Terminal 1 - Backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate

# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Start MongoDB (if local)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Run backend
uvicorn app.main:app --reload
```

✅ Backend running at http://localhost:8000

### Step 3: Frontend Setup (2 minutes)

```bash
# Terminal 2 - Frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Run frontend
npm run dev
```

✅ Frontend running at http://localhost:3000

### Step 4: Test the Application (1 minute)

1. Open browser: http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. Post a test item
5. Search and browse items

## 🎉 You're Done!

The application is now fully functional!

## Common Commands

### Backend
```bash
# Start backend
cd backend
venv\Scripts\activate  # Windows
uvicorn app.main:app --reload

# Check API docs
# Visit: http://localhost:8000/api/docs
```

### Frontend
```bash
# Start frontend
cd frontend
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Issue: MongoDB Connection Failed
**Solution**: 
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URL in backend/.env
```

### Issue: Port Already in Use
**Solution**:
```bash
# Backend - use different port
uvicorn app.main:app --reload --port 8001

# Frontend - use different port
npm run dev -- --port 3001
```

### Issue: Module Not Found
**Solution**:
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules
npm install
```

## Next Steps

1. **Read Documentation**: Check README.md for detailed information
2. **Customize Settings**: Edit `.env` files for your configuration
3. **Add Sample Data**: Post some test items to see the system in action
4. **Explore Features**:
   - User authentication
   - Image uploads
   - Smart matching
   - Search and filters

## Default Credentials

No default users - create your own account!

## Important URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs
- Health Check: http://localhost:8000/health

## File Structure at a Glance

```
Hackathon/
├── backend/          # FastAPI backend
│   ├── app/         # Application code
│   ├── .env         # Environment variables
│   └── requirements.txt
│
├── frontend/        # React frontend
│   ├── src/        # Source code
│   ├── .env        # Environment variables
│   └── package.json
│
└── README.md       # Main documentation
```

## Need Help?

- 📖 Read [README.md](README.md) for full documentation
- 🔧 Backend issues: Check [backend/SETUP.md](backend/SETUP.md)
- 🎨 Frontend issues: Check [frontend/SETUP.md](frontend/SETUP.md)
- 🐛 Report bugs: Open an issue on GitHub
- 💬 Questions: support@campuslostandfound.com

## Production Deployment

Ready to deploy? Check the deployment section in README.md:
- Backend: Railway, Heroku, or any Python hosting
- Frontend: Vercel, Netlify, or any static hosting
- Database: MongoDB Atlas (free tier available)

## Features to Explore

1. **Authentication** ✅
   - Register new account
   - Login/Logout
   - Password reset

2. **Browse Items** ✅
   - Search functionality
   - Filter by category, status, location
   - Pagination

3. **Post Items** ✅
   - Upload images (drag & drop)
   - Detailed descriptions
   - Location tagging

4. **Smart Matching** ✅
   - AI-powered matching
   - Similarity scoring
   - Suggestions

5. **Responsive Design** ✅
   - Mobile-friendly
   - Tablet-optimized
   - Desktop-ready

## Security Notes

⚠️ **Before Production**:
1. Change `SECRET_KEY` in backend/.env
2. Use MongoDB Atlas or secured MongoDB
3. Enable HTTPS
4. Update CORS settings
5. Set up proper authentication

## Performance Tips

- Backend handles async operations efficiently
- Frontend uses lazy loading
- Images are automatically optimized
- MongoDB queries are indexed

## Support

This is a production-ready application with:
- ✅ Clean, modern UI
- ✅ Secure authentication
- ✅ Smart matching algorithm
- ✅ Responsive design
- ✅ Full API documentation
- ✅ Error handling
- ✅ Form validation

Enjoy building with Campus Lost & Found! 🎓✨
