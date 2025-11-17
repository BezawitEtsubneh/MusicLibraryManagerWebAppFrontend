'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import axios from 'axios'

interface AuthContextType {
  user: any
  loginUser: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Backend URL
const BASE_URL = "http://localhost:8000"

// Set up Axios defaults immediately
axios.defaults.baseURL = BASE_URL
axios.defaults.withCredentials = true

const setupAxiosInterceptors = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setToken(savedToken)
      setupAxiosInterceptors(savedToken)
      fetchMeWithToken(savedToken)
    } else {
      fetchMe() // try fetching user from cookie only
    }
  }, [])

  // Fetch user from backend using token (if available)
  const fetchMeWithToken = async (authToken: string) => {
    try {
      const res = await axios.get('/users/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setUser(res.data)
    } catch {
      setUser(null)
      localStorage.removeItem('auth_token')
      setToken(null)
    }
  }

  // Fetch user from backend without token (cookie-based)
  const fetchMe = async () => {
    try {
      const res = await axios.get('/users/me')
      setUser(res.data)
    } catch {
      setUser(null)
    }
  }

  // Login user and store token
  const loginUser = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        '/token', // full URL not needed; baseURL is set
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )

      const authToken = response.data.access_token
      if (authToken) {
        localStorage.setItem('auth_token', authToken)
        setToken(authToken)
        setupAxiosInterceptors(authToken)
      }

      await fetchMeWithToken(authToken)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      setToken(null)
      setUser(null)
      setupAxiosInterceptors(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
