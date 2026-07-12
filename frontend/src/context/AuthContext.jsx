import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useToast } from '../components/ui'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  // Fetch current user details using token
  const fetchCurrentUser = useCallback(async (authToken) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        // Token invalid or expired
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    } catch (err) {
      console.error('Error fetching current user:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Check authentication on boot
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token)
    } else {
      setLoading(false)
    }
  }, [token, fetchCurrentUser])

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      toast.show('Logged in successfully!', 'success')
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.message }
    }
  }

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      toast.show('Registration successful! You can now log in.', 'success')
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.message }
    }
  }

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.show('Logged out successfully!', 'info')
  }, [toast])

  // Authenticated fetch wrapper to automatically include JWT header
  const authFetch = useCallback(async (url, options = {}) => {
    const activeToken = token || localStorage.getItem('token')
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    }

    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (response.status === 401) {
      // Automatic logout on unauthorized status
      logout()
    }

    return response;
  }, [token, logout])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
