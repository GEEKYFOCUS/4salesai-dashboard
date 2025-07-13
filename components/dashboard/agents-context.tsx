"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export interface Agent {
  id: string | number
  name: string
  description: string
  status: string
  conversations: number
  conversions: number
  lastActive: string
  industry?: string
  personality?: string
  avatar?: string
}

interface AgentsContextType {
  agents: Agent[]
  addAgent: (agent: Agent) => void
  updateAgent: (agent: Agent) => void
  deleteAgent: (id: string | number) => void
  reloadAgents: () => void
}

const defaultAgents: Agent[] = [
  {
    id: 1,
    name: "Sales Agent Pro",
    description: "Primary sales agent for lead qualification and conversion",
    status: "active",
    conversations: 0,
    conversions: 0,
    lastActive: "-",
    industry: "technology",
    personality: "professional",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Support Assistant",
    description: "Customer support and technical assistance agent",
    status: "active",
    conversations: 0,
    conversions: 0,
    lastActive: "-",
    industry: "technology",
    personality: "friendly",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
]

const AgentsContext = createContext<AgentsContextType | undefined>(undefined)

export const AgentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([])

  // Load agents from localStorage or use defaults
  const loadAgents = () => {
    const userAgents = JSON.parse(localStorage.getItem("userAgents") || "[]")
    if (userAgents.length > 0) {
      setAgents(userAgents)
    } else {
      setAgents(defaultAgents)
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  // Save to localStorage whenever agents change
  useEffect(() => {
    localStorage.setItem("userAgents", JSON.stringify(agents))
  }, [agents])

  const addAgent = (agent: Agent) => {
    setAgents(prev => [...prev, agent])
  }

  const updateAgent = (updated: Agent) => {
    setAgents(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a))
  }

  const deleteAgent = (id: string | number) => {
    setAgents(prev => prev.filter(a => a.id !== id))
  }

  const reloadAgents = loadAgents

  return (
    <AgentsContext.Provider value={{ agents, addAgent, updateAgent, deleteAgent, reloadAgents }}>
      {children}
    </AgentsContext.Provider>
  )
}

export const useAgents = () => {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error("useAgents must be used within an AgentsProvider")
  return ctx
} 