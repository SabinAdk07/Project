# 🚀 START HERE - Quick Launch Guide

## ✅ Backend is Already Running!

Your backend server is running at: **http://localhost:8000**

Test it: http://localhost:8000/health

## 📝 Next Step: Start Frontend

Open a **NEW PowerShell terminal** (don't close the backend terminal) and run:

```powershell
cd E:\Hackathon\frontend
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## 🔄 To Restart Everything Later

### Terminal 1 - Backend:
```powershell
cd E:\Hackathon
.\start-backend.ps1
```

### Terminal 2 - Frontend:
```powershell
cd E:\Hackathon
.\start-frontend.ps1
```

---

## ✨ Your Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health

---

## 🎯 What to Do Now

1. ✅ Backend is running (current terminal)
2. ⏭️ Open NEW terminal for frontend
3. 🌐 Access http://localhost:3000
4. 📝 Create account and start using!

---

## 🐛 If Something Goes Wrong

### Backend Not Working?
```powershell
cd E:\Hackathon\backend
$env:PYTHONPATH="E:\Hackathon\backend"
E:/Hackathon/.venv/Scripts/python.exe -m uvicorn app.main:app --reload
```

### Frontend Not Working?
```powershell
cd E:\Hackathon\frontend
npm install
npm run dev
```

### MongoDB Not Running?
```powershell
net start MongoDB
```

---

## 📸 Expected Output

### Backend Terminal:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
✅ Connected to MongoDB
🚀 Application started successfully
```

### Frontend Terminal:
```
VITE v5.0.11  ready in X ms
➜  Local:   http://localhost:3000/
```

---

## 🎉 Features to Try

1. **Sign Up** - Create a new account
2. **Post Item** - Add a lost or found item with images
3. **Browse** - Search and filter items
4. **Find Matches** - Use smart matching to find your lost items
5. **Responsive** - Try on mobile (press F12 → Toggle Device Toolbar)

---

## 💡 Pro Tips

- Keep both terminals open while working
- Press `Ctrl+C` in terminal to stop a server
- Changes auto-reload (no need to restart)
- Check browser console (F12) for errors
- Use API docs: http://localhost:8000/api/docs

---

## 📚 More Information

- Full Documentation: `README.md`
- Backend Setup: `backend/SETUP.md`
- Frontend Setup: `frontend/SETUP.md`
- Project Summary: `PROJECT_SUMMARY.md`

---

**Made with ❤️ for campus communities**
