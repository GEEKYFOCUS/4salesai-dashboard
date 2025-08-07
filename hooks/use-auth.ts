"use client"

import { getUser } from "@/app/_lib/data-service"
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: any | null
  isLoading: boolean
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
const fetchUser = async () => {
  // const user = await getUser(token)
  setUser(()=> {
    return { 
        status: 'success',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODQyMTFjZTAyMmM3Mjg1ODJhZDMxMCIsImlhdCI6MTc1MzUzMTU4MCwiZXhwIjoxNzU0MTM2MzgwfQ.DuMAli0lT21aLShnw22jceRBXyEG-vkAjqJZyDrwGsk',
        data: {
          user: {
            _id: '6884211ce022c728582ad310',
            email: 'tester@gmail.com',
            name: 'Support Star',
            avatar: 'https://robohash.org/tester%40gmail.com.png',
            userId: '6884211ce022c728582ad310',
            createdAt: '2025-07-26T00:28:12.390Z',
            updatedAt: '2025-07-26T00:28:12.390Z',
            id: '6884211ce022c728582ad310'
          }
        }
  }
  })
  setIsLoading(false)
}
fetchUser()
  }, [])


console.log(user, "user")
  return React.createElement(
    AuthContext.Provider,
    { value: { user, isLoading,} },
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

 