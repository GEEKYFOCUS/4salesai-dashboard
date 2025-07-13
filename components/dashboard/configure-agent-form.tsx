"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Save, Settings, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ConfigureAgentFormProps {
  agentId: string
}

export function ConfigureAgentForm({ agentId }: ConfigureAgentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [agent, setAgent] = useState<any>(null)
  const [config, setConfig] = useState({
    // Response Settings
    responseSpeed: [2],
    creativity: [5],
    empathy: [5],

    // Automation Settings
    autoRespond: true,
    workingHours: [
      { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Wednesday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Friday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Saturday', enabled: false, start: '09:00', end: '17:00' },
      { day: 'Sunday', enabled: false, start: '09:00', end: '17:00' },
    ],
    timezone: "UTC",

    // Call Settings
    enableCalls: false,
    maxCallDuration: [30],
    callRetryAttempts: [3],

    // Lead Qualification
    autoQualify: true,
    qualificationCriteria: "",
    handoffThreshold: [8],
  })

  useEffect(() => {
    // Load agent data
    const loadAgent = () => {
      const userAgents = JSON.parse(localStorage.getItem("userAgents") || "[]")
      const defaultAgents = [
        { id: 1, name: "Sales Agent Pro" },
        { id: 2, name: "Support Assistant" },
      ]

      const allAgents = [...defaultAgents, ...userAgents]
      const foundAgent = allAgents.find((a) => a.id.toString() === agentId)

      if (foundAgent) {
        setAgent(foundAgent)
        // Load existing config if available
        const savedConfig = localStorage.getItem(`agentConfig_${agentId}`)
        if (savedConfig) {
          setConfig({ ...config, ...JSON.parse(savedConfig) })
        }
      }
    }

    loadAgent()
  }, [agentId])

  const handleConfigChange = (field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save configuration
    localStorage.setItem(`agentConfig_${agentId}`, JSON.stringify(config))

    setIsLoading(false)
    alert("Configuration saved successfully!")
  }

  if (!agent) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>Agent not found or loading...</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configure: {agent.name}</h1>
          <p className="text-gray-600">Customize your agent's behavior and automation settings</p>
        </div>
      </div>

      <Tabs defaultValue="behavior" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>Response Behavior</span>
                </CardTitle>
                <CardDescription>Configure how your agent responds to conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Response Speed: {config.responseSpeed[0]} seconds</Label>
                    <Slider
                      value={config.responseSpeed}
                      onValueChange={(value) => handleConfigChange("responseSpeed", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">How quickly the agent responds to messages</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Creativity Level: {config.creativity[0]}/10</Label>
                    <Slider
                      value={config.creativity}
                      onValueChange={(value) => handleConfigChange("creativity", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">How creative and varied the responses should be</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Empathy Level: {config.empathy[0]}/10</Label>
                    <Slider
                      value={config.empathy}
                      onValueChange={(value) => handleConfigChange("empathy", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">How empathetic and understanding the agent should be</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span>Automation Settings</span>
                </CardTitle>
                <CardDescription>Configure when and how your agent operates automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-respond to messages</Label>
                    <p className="text-sm text-gray-500">Automatically respond to incoming messages</p>
                  </div>
                  <Switch
                    checked={config.autoRespond}
                    onCheckedChange={(checked) => handleConfigChange("autoRespond", checked)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Working Hours (per day)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.workingHours.map((dayConfig, idx) => (
                      <div key={dayConfig.day} className="flex items-center space-x-3">
                        <Switch
                          checked={dayConfig.enabled}
                          onCheckedChange={checked => {
                            const updated = [...config.workingHours]
                            updated[idx].enabled = checked
                            handleConfigChange("workingHours", updated)
                          }}
                        />
                        <span className="w-20">{dayConfig.day}</span>
                        <Input
                          type="time"
                          value={dayConfig.start}
                          disabled={!dayConfig.enabled}
                          className="w-28"
                          onChange={e => {
                            const updated = [...config.workingHours]
                            updated[idx].start = e.target.value
                            handleConfigChange("workingHours", updated)
                          }}
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          value={dayConfig.end}
                          disabled={!dayConfig.enabled}
                          className="w-28"
                          onChange={e => {
                            const updated = [...config.workingHours]
                            updated[idx].end = e.target.value
                            handleConfigChange("workingHours", updated)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Set working hours for each day. Toggle off to disable for that day.</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-qualify leads</Label>
                    <p className="text-sm text-gray-500">Automatically qualify leads based on criteria</p>
                  </div>
                  <Switch
                    checked={config.autoQualify}
                    onCheckedChange={(checked) => handleConfigChange("autoQualify", checked)}
                  />
                </div>

                {config.autoQualify && (
                  <div className="space-y-2">
                    <Label>Handoff Threshold: {config.handoffThreshold[0]}/10</Label>
                    <Slider
                      value={config.handoffThreshold}
                      onValueChange={(value) => handleConfigChange("handoffThreshold", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">When to hand off to human (higher = more selective)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span>Call Settings</span>
                </CardTitle>
                <CardDescription>Configure automated calling behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable automated calls</Label>
                    <p className="text-sm text-gray-500">Allow agent to make automated phone calls</p>
                  </div>
                  <Switch
                    checked={config.enableCalls}
                    onCheckedChange={(checked) => handleConfigChange("enableCalls", checked)}
                  />
                </div>

                {config.enableCalls && (
                  <>
                    <div className="space-y-2">
                      <Label>Max Call Duration: {config.maxCallDuration[0]} minutes</Label>
                      <Slider
                        value={config.maxCallDuration}
                        onValueChange={(value) => handleConfigChange("maxCallDuration", value)}
                        max={60}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Retry Attempts: {config.callRetryAttempts[0]}</Label>
                      <Slider
                        value={config.callRetryAttempts}
                        onValueChange={(value) => handleConfigChange("callRetryAttempts", value)}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
