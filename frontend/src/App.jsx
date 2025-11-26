import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

// Import components (we'll create these in next steps)
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import Diet from './pages/Diet'
import WaterTracker from './pages/WaterTracker'
import Profile from './pages/Profile'

// Auth context (we'll create this in next steps)
import { AuthProvider, useAuth } from './context/AuthContext'

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Apply theme to data attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <AuthProvider>
      <Router>
        <div className={`theme-transition ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ minHeight: '100vh' }}>
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <main className="container-fluid p-0">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/workouts" element={
                <ProtectedRoute>
                  <Workouts />
                </ProtectedRoute>
              } />
              <Route path="/diet" element={
                <ProtectedRoute>
                  <Diet />
                </ProtectedRoute>
              } />
              <Route path="/water" element={
                <ProtectedRoute>
                  <WaterTracker />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
}

export default App