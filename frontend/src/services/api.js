import axios from 'axios'

// Use absolute URL for development
const API_BASE_URL = 'http://localhost:8000/api'


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to false for development
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error)
      return Promise.reject(new Error('Network error: Could not connect to server'))
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Refresh token failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api