import React, { useState, useEffect } from 'react'
import { Alert, Button, Spinner, Card } from 'react-bootstrap'
import api from '../services/api'

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [message, setMessage] = useState('')
  const [apiError, setApiError] = useState(null)

  const testConnection = async () => {
    setConnectionStatus('testing')
    setMessage('Testing connection to backend...')
    setApiError(null)
    
    try {
      // Test basic API connection
      const response = await api.get('/auth/profile/')
      setConnectionStatus('success')
      setMessage('✅ Backend connection successful! API is responding.')
    } catch (error) {
      setConnectionStatus('error')
      
      if (error.code === 'ERR_NETWORK') {
        setMessage('❌ Cannot connect to backend server.')
        setApiError('Make sure Django server is running on http://localhost:8000')
      } else if (error.response) {
        if (error.response.status === 401) {
          setMessage('✅ Backend is running! (401 Unauthorized - expected for profile without login)')
          setConnectionStatus('success')
        } else {
          setMessage(`❌ Backend responded with error: ${error.response.status}`)
          setApiError(`Error: ${error.response.status} - ${error.response.statusText}`)
        }
      } else {
        setMessage(`❌ Connection error: ${error.message}`)
        setApiError(error.message)
      }
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Alert variant={connectionStatus === 'success' ? 'success' : connectionStatus === 'error' ? 'danger' : 'warning'}>
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <strong>Backend Connection Status:</strong>
          <div className="mt-1">{message}</div>
          {apiError && (
            <div className="mt-2">
              <small className="text-muted">{apiError}</small>
            </div>
          )}
        </div>
        {connectionStatus === 'testing' ? (
          <Spinner animation="border" size="sm" className="ms-2" />
        ) : (
          <Button variant="outline-secondary" size="sm" onClick={testConnection} className="ms-2">
            Test Again
          </Button>
        )}
      </div>
    </Alert>
  )
}

export default ConnectionTest