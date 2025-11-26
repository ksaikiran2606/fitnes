import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        // Verify token is still valid by making an API call
        const response = await api.get('/auth/profile/')
        setUser(response.data)
      } catch (error) {
        console.error('Token validation failed:', error)
        logout()
      }
    }
    setLoading(false)
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password
      })

      const { access, refresh, user: userData } = response.data

      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data) {
        // Handle non-standard error formats
        errorMessage = JSON.stringify(error.response.data)
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed'
      
      if (error.response?.data) {
        // Format Django validation errors
        if (typeof error.response.data === 'object') {
          const errors = []
          for (const [key, value] of Object.entries(error.response.data)) {
            if (Array.isArray(value)) {
              errors.push(...value)
            } else {
              errors.push(value)
            }
          }
          errorMessage = errors.join(', ')
        } else {
          errorMessage = error.response.data
        }
      }
      
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  const logout = () => {
    const refreshToken = localStorage.getItem('refresh_token')
    
    // Try to call logout endpoint if we have a refresh token
    if (refreshToken) {
      api.post('/auth/logout/', { refresh_token: refreshToken })
        .catch(error => console.error('Logout API call failed:', error))
    }
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile/update/', profileData)
      const updatedUser = { ...user, ...response.data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return { success: true }
    } catch (error) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        error: error.response?.data || 'Profile update failed' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}