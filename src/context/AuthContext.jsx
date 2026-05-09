import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const AUTH_KEY = 'tripugo_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null }
  })

  const login = (email, password) => {
    // Demo login — replace with real API call later
    const stored = JSON.parse(localStorage.getItem('tripugo_users') || '[]')
    const found = stored.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const userData = { name: found.name, email: found.email, avatar: found.name[0].toUpperCase() }
    setUser(userData)
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    return userData
  }

  const register = (name, email, password) => {
    const stored = JSON.parse(localStorage.getItem('tripugo_users') || '[]')
    if (stored.find(u => u.email === email)) throw new Error('Email already registered')
    const newUser = { name, email, password }
    localStorage.setItem('tripugo_users', JSON.stringify([...stored, newUser]))
    const userData = { name, email, avatar: name[0].toUpperCase() }
    setUser(userData)
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
