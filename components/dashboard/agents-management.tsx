"use client"

import { useAgents } from "@/components/dashboard/agents-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bot, MoreHorizontal, Pause, Play, Plus, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function AgentsManagement() {
  const router = useRouter()
  const { agents } = useAgents()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600">Manage your AI sales agents and their performance</p>
        </div>
        <Button onClick={() => router.push("/dashboard/agents/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow">
                    <AvatarImage src={agent.avatar} alt={agent.name} className="object-cover" />
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/agents/${agent.id}/edit`)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/agents/${agent.id}/configure`)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {agent.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Agent
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate Agent
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conversations:</span>
                  <span className="font-medium">{agent.conversations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conversions:</span>
                  <span className="font-medium">{agent.conversions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="font-medium">{agent.lastActive}</span>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => router.push(`/dashboard/agents/${agent.id}/edit`)}
                  >
                    Manage Agent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
