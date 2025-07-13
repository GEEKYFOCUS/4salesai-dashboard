"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "member"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS = {
  "member@4salesai.com": {
    id: "1",
    name: "Member User",
    email: "member@4salesai.com",
    role: "member" as const,
    password: "member123",
  },
}

const ROLE_PERMISSIONS: Record<User['role'], string[]> = {
  member: [],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]

    if (demoUser && demoUser.password === password) {
      const user = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return ROLE_PERMISSIONS[user.role].includes(permission)
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, isLoading, login, logout, hasPermission } },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
