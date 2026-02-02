# Campus Lost & Found Portal

A modern, full-stack web application for managing lost and found items on campus. Built with React.js, FastAPI, and MongoDB.

![Campus Lost & Found](https://img.shields.io/badge/status-production--ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)

## 🌟 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with registration, login, and password reset
- **Browse Items**: Search and filter lost/found items by category, status, location, and date
- **Smart Matching**: AI-powered matching algorithm to find potential matches for lost items
- **Image Upload**: Drag-and-drop image uploads with automatic optimization
- **Responsive Design**: Fully responsive UI with Tailwind CSS, optimized for desktop, tablet, and mobile
- **Real-time Notifications**: Toast notifications for user actions and feedback

### User Experience
- **Attractive UI**: Modern design with blue/green color scheme and smooth animations
- **Accessibility**: ARIA labels, keyboard navigation, and alt text for images
- **Loading States**: Elegant loading spinners and skeleton screens
- **Form Validation**: Client-side validation with helpful error messages
- **Protected Routes**: Automatic redirection for authenticated routes

### Backend Features
- **RESTful API**: Clean, well-documented API endpoints
- **Database**: MongoDB with async operations using Motor
- **Security**: Password hashing, JWT tokens, rate limiting, input sanitization
- **File Management**: Local or cloud-based (Cloudinary) image storage
- **Error Handling**: Comprehensive error handling and logging

## 📁 Project Structure

```
Hackathon/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── config.py          # Configuration settings
│   │   ├── main.py            # Application entry point
│   │   ├── models/            # Pydantic models
│   │   │   ├── user.py
│   │   │   └── item.py
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── items.py
│   │   │   ├── matches.py
│   │   │   └── upload.py
│   │   └── utils/             # Utilities
│   │       ├── database.py
│   │       └── security.py
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variables template
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ItemCard.jsx
    │   │   ├── ImageUpload.jsx
    │   │   ├── PostItemModal.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── contexts/          # React contexts
    │   │   └── AuthContext.jsx
    │   ├── pages/             # Page components
    │   │   ├── Login.jsx
    │   │   ├── Home.jsx
    │   │   ├── BrowseItems.jsx
    │   │   └── ViewMatches.jsx
    │   ├── services/          # API services
    │   │   └── api.js
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── package.json           # Node dependencies
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind configuration
    └── .env.example          # Environment variables template
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: 3.9 or higher
- **MongoDB**: 6.0 or higher (local or MongoDB Atlas)
- **Git**: Latest version

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   # Copy example file
   copy .env.example .env

   # Edit .env with your settings
   # Required:
   MONGODB_URL=mongodb://localhost:27017
   SECRET_KEY=your-secure-random-secret-key-here
   
   # Optional (for cloud storage):
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

6. **Run the backend**:
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at: `http://localhost:8000`
   API docs: `http://localhost:8000/api/docs`

### Frontend Setup

1. **Navigate to frontend directory** (new terminal):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy example file
   copy .env.example .env

   # Edit .env if needed (default values should work)
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the frontend**:
   ```bash
   npm run dev
   ```

   The app will be available at: `http://localhost:3000`

### Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Create an account or login
3. Start posting and searching for lost/found items!

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user info

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/stats` - Get item statistics
- `GET /api/items/{item_id}` - Get item by ID
- `POST /api/items` - Create new item (auth required)
- `PUT /api/items/{item_id}` - Update item (auth required)
- `DELETE /api/items/{item_id}` - Delete item (auth required)
- `GET /api/items/user/my-items` - Get user's items (auth required)

### Matches
- `POST /api/matches` - Find matching items (auth required)
- `GET /api/matches/suggestions` - Get suggestions (auth required)

### Upload
- `POST /api/upload` - Upload single file (auth required)
- `POST /api/upload/multiple` - Upload multiple files (auth required)
- `DELETE /api/upload/{filename}` - Delete file (auth required)

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue (#0095e6) - Trustworthy, professional
- **Secondary**: Green (#00b388) - Campus-like, nature
- **Gradients**: Smooth transitions for visual appeal

### Animations
- Fade-in animations for images and cards
- Hover effects on interactive elements
- Smooth transitions on state changes
- Loading spinners for async operations

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: API rate limiting with slowapi
- **Input Sanitization**: XSS prevention
- **CORS**: Configured for frontend origin
- **File Validation**: Type and size validation for uploads

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment (Railway/Heroku)

1. **Create Railway/Heroku account** and install CLI

2. **Deploy backend**:
   ```bash
   cd backend
   
   # Railway
   railway login
   railway init
   railway up
   
   # Heroku
   heroku login
   heroku create campus-lostandfound-api
   git push heroku main
   ```

3. **Set environment variables** in Railway/Heroku dashboard

4. **Configure MongoDB Atlas** for production database

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend**:
   ```bash
   cd frontend
   vercel login
   vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - `VITE_API_URL`: Your backend URL

### Environment Variables for Production

**Backend (.env)**:
```env
MONGODB_URL=your-mongodb-atlas-url
SECRET_KEY=your-production-secret-key
FRONTEND_URL=https://your-frontend-url.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend (.env)**:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React.js team for the amazing framework
- FastAPI team for the excellent Python framework
- MongoDB team for the database
- Tailwind CSS for the styling framework
- All contributors and users

## 📞 Support

For support, email support@campuslostandfound.com or join our Slack channel.

## 🐛 Bug Reports

Please report bugs by opening an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

---

Made with ❤️ for campus communities
#   P r o j e c t  
 #   P r o j e c t  
 