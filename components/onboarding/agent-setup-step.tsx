"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AgentSetupStepProps {
  onNext: (data: any) => void
  onBack: () => void
  canGoBack: boolean
  formData: any
}

export function AgentSetupStep({ onNext, onBack, canGoBack, formData }: AgentSetupStepProps) {
  const [agentData, setAgentData] = useState({
    name: formData.agentName || `${formData.companyName || "Sales"} Agent`,
    personality: formData.personality || "",
    goals: formData.goals || "",
    communicationStyle: formData.communicationStyle || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ agentName: agentData.name, ...agentData })
  }

  const handleInputChange = (field: string, value: string) => {
    setAgentData((prev) => ({ ...prev, [field]: value }))
  }

  const personalityOptions = [
    { value: "professional", label: "Professional", description: "Formal, knowledgeable, and trustworthy" },
    { value: "friendly", label: "Friendly", description: "Warm, approachable, and conversational" },
    { value: "consultative", label: "Consultative", description: "Advisory, solution-focused, and helpful" },
    { value: "enthusiastic", label: "Enthusiastic", description: "Energetic, passionate, and motivating" },
  ]

  return (
    <>
      <CardHeader>
        <CardTitle>Configure your AI Sales Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name *</Label>
            <Input
              id="agentName"
              placeholder="Sales Agent"
              value={agentData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Personality Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personalityOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    agentData.personality === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleInputChange("personality", option.value)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{option.label}</h3>
                    {agentData.personality === option.value && <Badge variant="default">Selected</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Primary Goals *</Label>
            <Textarea
              id="goals"
              placeholder="What should your agent focus on? (e.g., qualify leads, book demos, close sales, provide support...)"
              value={agentData.goals}
              onChange={(e) => handleInputChange("goals", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="communicationStyle">Communication Guidelines</Label>
            <Textarea
              id="communicationStyle"
              placeholder="Any specific instructions for how your agent should communicate? (tone, language, things to avoid...)"
              value={agentData.communicationStyle}
              onChange={(e) => handleInputChange("communicationStyle", e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Preview</h3>
            <p className="text-sm text-blue-700">
              Your agent "{agentData.name}" will have a{" "}
              <span className="font-medium">
                {personalityOptions.find((p) => p.value === agentData.personality)?.label || "professional"}
              </span>{" "}
              personality and will be trained on your business information to help achieve your sales goals.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            {canGoBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              Create Agent
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  )
}
