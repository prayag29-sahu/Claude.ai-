import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('lr_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
    localStorage.setItem('lr_user', JSON.stringify(data.user))
    localStorage.setItem('lr_token', data.token)
    return data.user
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lr_user')
    localStorage.removeItem('lr_token')
  }

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    setUser(data.user)
    localStorage.setItem('lr_user', JSON.stringify(data.user))
    localStorage.setItem('lr_token', data.token)
    return data.user
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
