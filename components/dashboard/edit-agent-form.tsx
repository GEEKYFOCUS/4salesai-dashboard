"use client"

import type React from "react"

import { useAgents } from "@/components/dashboard/agents-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Bot, Save, Trash2, Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const personalityOptions = [
  { value: "professional", label: "Professional", description: "Formal, knowledgeable, and trustworthy" },
  { value: "friendly", label: "Friendly", description: "Warm, approachable, and conversational" },
  { value: "consultative", label: "Consultative", description: "Advisory, solution-focused, and helpful" },
  { value: "enthusiastic", label: "Enthusiastic", description: "Energetic, passionate, and motivating" },
]

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Real Estate",
  "Education",
  "Marketing",
  "Other",
]

// Default dummy avatars
const defaultAvatars = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
]

interface EditAgentFormProps {
  agentId: string
}

export function EditAgentForm({ agentId }: EditAgentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { agents, updateAgent, deleteAgent } = useAgents()
  const [agent, setAgent] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    otherIndustry: "",
    personality: "",
    avatar: "",
  })
  const [showOtherIndustry, setShowOtherIndustry] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    // Load agent data
    const foundAgent = agents.find((a) => a.id.toString() === agentId)
    if (foundAgent) {
      setAgent(foundAgent)
      const isOtherIndustry = Boolean(foundAgent.industry && !industryOptions.slice(0, -1).map(opt => opt.toLowerCase()).includes(foundAgent.industry))
      setShowOtherIndustry(isOtherIndustry)
      setFormData({
        name: foundAgent.name || "",
        description: foundAgent.description || "",
        industry: isOtherIndustry ? "other" : (foundAgent.industry || ""),
        otherIndustry: isOtherIndustry ? (foundAgent.industry || "") : "",
        personality: foundAgent.personality || "",
        avatar: foundAgent.avatar || defaultAvatars[0],
      })
    }
  }, [agentId, agents])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleIndustryChange = (value: string) => {
    if (value === "other") {
      setShowOtherIndustry(true)
      setFormData(prev => ({ ...prev, industry: "other", otherIndustry: "" }))
    } else {
      setShowOtherIndustry(false)
      setFormData(prev => ({ ...prev, industry: value, otherIndustry: "" }))
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const selectDefaultAvatar = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Determine the final industry value
    const finalIndustry = formData.industry === "other" ? formData.otherIndustry : formData.industry

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateAgent({
      ...agent,
      ...formData,
      industry: finalIndustry,
    })
    setIsLoading(false)
    toast({
      title: "Agent updated",
      description: "Agent updated successfully!",
      variant: "default"
    })
    router.push("/dashboard/agents")
  }

  const handleDelete = async () => {
    setShowDeleteDialog(false)
    deleteAgent(agent.id)
    setShowDeleteDialog(false)
    toast({
      title: "Agent deleted",
      description: "Agent deleted successfully!",
      variant: "default"
    })
    router.push("/dashboard/agents")
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Agent: {agent.name}</h1>
            <p className="text-gray-600">Update your AI agent's configuration</p>
          </div>
        </div>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Agent
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Agent</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this agent? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <span>Agent Configuration</span>
              </CardTitle>
              <CardDescription>Update your AI agent's personality, goals, and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Agent Avatar</h3>
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-28 w-28 shadow-lg border-4 border-white">
                      <AvatarImage src={formData.avatar} alt={formData.name} className="rounded-full object-cover" />
                      <AvatarFallback>
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="default"
                        size="lg"
                        className="rounded-full px-6 py-2 flex items-center gap-2 shadow-sm hover:bg-blue-600 transition"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-5 w-5" />
                        Upload Custom Avatar
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        aria-label="Upload avatar"
                      />
                      <p className="text-xs text-muted-foreground">Or choose from default avatars below</p>
                    </div>
                  </div>
                  {/* Default Avatars */}
                  <div className="grid grid-cols-6 gap-4 mt-2">
                    {defaultAvatars.map((avatar, index) => (
                      <div
                        key={index}
                        title="Click to select"
                        className={`group cursor-pointer rounded-full border-4 p-1 transition-all duration-150 flex items-center justify-center shadow-sm bg-white hover:shadow-lg ${
                          formData.avatar === avatar ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => selectDefaultAvatar(avatar)}
                      >
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={avatar} alt={`Default avatar ${index + 1}`} className="rounded-full object-cover" />
                          <AvatarFallback>
                            <User className="h-7 w-7" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold">Agent Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Sales Pro Agent"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="font-semibold">Industry *</Label>
                      <Select value={formData.industry} onValueChange={handleIndustryChange}>
                        <SelectTrigger className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry} value={industry.toLowerCase()}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {showOtherIndustry && (
                    <div className="space-y-2">
                      <Label htmlFor="otherIndustry" className="font-semibold">Specify Industry *</Label>
                      <Input
                        id="otherIndustry"
                        placeholder="Enter your industry"
                        value={formData.otherIndustry}
                        onChange={(e) => handleInputChange("otherIndustry", e.target.value)}
                        required
                        className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this agent will do and its primary purpose..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                      required
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Personality */}
                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Personality Type *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalityOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-150 shadow-sm bg-white hover:shadow-md ${
                          formData.personality === option.value
                            ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => handleInputChange("personality", option.value)}
                        title={option.description}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-base">{option.label}</h4>
                          {formData.personality === option.value && <Badge variant="default">Selected</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-8 border-t mt-8">
                  <Button type="button" variant="outline" className="rounded-full px-6 py-2" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="rounded-full px-6 py-2 shadow-sm bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-center">Agent Preview</CardTitle>
              <CardDescription className="text-center">How your agent will appear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <Avatar className="h-20 w-20 shadow-md border-4 border-white mx-auto">
                <AvatarImage src={formData.avatar} alt={formData.name} className="rounded-full object-cover" />
                <AvatarFallback>
                  <Bot className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-xl">{formData.name || "Agent Name"}</h3>
                {formData.industry && (
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {formData.industry === "other" ? formData.otherIndustry : formData.industry || "Industry"}
                  </span>
                )}
              </div>
              {formData.personality && (
                <div className="flex flex-col items-center">
                  <Label className="text-xs font-medium text-muted-foreground">Personality</Label>
                  <Badge variant="default" className="mt-1">{personalityOptions.find((p) => p.value === formData.personality)?.label}</Badge>
                </div>
              )}
              {formData.description && (
                <div className="w-full">
                  <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm text-gray-600 mt-1 text-center">{formData.description}</p>
                </div>
              )}
              <div className="bg-blue-50 p-3 rounded-lg w-full text-center">
                <p className="text-sm text-blue-700">
                  <strong>Status:</strong> Changes will be applied immediately after saving.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
