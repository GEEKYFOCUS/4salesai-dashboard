"use client"

import { useAgents } from "@/components/dashboard/agents-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Globe, Link2, Send } from "lucide-react"
import { useState } from "react"

const deploymentOptions = [
  { key: "whatsapp", label: "WhatsApp", icon: Send },
  { key: "telegram", label: "Telegram", icon: Send },
  { key: "webapp", label: "Dynamic Agent Webapp", icon: Globe },
  { key: "iframe", label: "Website iFrame", icon: Link2 },
]

export default function DeploymentPage() {
  const { agents } = useAgents()
  const [openAgentId, setOpenAgentId] = useState<string | number | null>(null)

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Deployment</h1>
      <p className="text-muted-foreground mb-6">Deploy your AI agents to various channels and platforms.</p>
      <div className="grid gap-6">
        {agents.map(agent => (
          <Card key={agent.id} className="">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </div>
              <div className="ml-auto">
                <Button variant="outline" onClick={() => setOpenAgentId(openAgentId === agent.id ? null : agent.id)}>
                  Deploy
                </Button>
              </div>
            </CardHeader>
            {openAgentId === agent.id && (
              <CardContent className="border-t pt-4 mt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deploymentOptions.map(opt => (
                    <div key={opt.key} className="flex flex-col items-start gap-2 p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <opt.icon className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">{opt.label}</span>
                      </div>
                      {opt.key === "iframe" ? (
                        <div className="w-full mt-2">
                          <label className="block text-xs text-gray-500 mb-1">Embed this iFrame in your website:</label>
                          <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto select-all">
{`<iframe src="https://yourdomain.com/agents/${agent.id}/webapp" width="400" height="600" style="border:none;"></iframe>`}
                          </pre>
                        </div>
                      ) : (
                        <Button size="sm" className="mt-2">Connect</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
} 