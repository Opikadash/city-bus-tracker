import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthState {
  user: { id: string; email: string; name: string } | null
  token: string | null
  loading: boolean
}

interface AuthContextType {
  auth: AuthState
  login: (token: string, user: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    loading: true
  })

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      setAuth({
        user: JSON.parse(user),
        token,
        loading: false
      })
    } else {
      setAuth(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const login = (token: string, user: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAuth({ user, token, loading: false })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth({ user: null, token: null, loading: false })
  }

  const value = { auth, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

