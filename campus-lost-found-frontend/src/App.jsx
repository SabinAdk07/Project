import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Matches from './pages/Matches'

// Components
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route 
            path="/browse" 
            element={
              <PrivateRoute>
                <Browse />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/matches" 
            element={
              <PrivateRoute>
                <Matches />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App
