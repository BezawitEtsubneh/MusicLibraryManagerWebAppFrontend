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

// Configure axios to include token in requests
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

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setToken(savedToken)
      setupAxiosInterceptors(savedToken)
      // Try to fetch user with saved token
      fetchMeWithToken(savedToken)
    }
  }, [])

  // fetch currently logged in user
  const fetchMe = async () => {
    const res = await axios.get("/auth/users/me", {
      withCredentials: true, // important for cookie auth
    })
    return res.data
  }

  const fetchMeWithToken = async (authToken: string) => {
    try {
      const res = await axios.get("/auth/users/me", {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      })
      setUser(res.data)
    } catch (error: any) {
      const status = error?.response?.status
      if (status !== 401) {
        console.error('Error loading user:', error)
      }
      setUser(null)
      localStorage.removeItem('auth_token')
      setToken(null)
    }
  }

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        '/auth/token',
        new URLSearchParams({ username, password }),
        { withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      
      // Save token from response
      const authToken = response.data.access_token
      if (authToken) {
        localStorage.setItem('auth_token', authToken)
        setToken(authToken)
        setupAxiosInterceptors(authToken)
        console.log('Login successful, token saved')
      }
      
      // Fetch user info
      const me = await fetchMe()
      setUser(me)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true })
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
