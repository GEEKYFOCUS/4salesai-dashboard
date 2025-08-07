"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Bot, Globe, Target, MessageSquare } from "lucide-react"
import { useState } from "react"
import { createAIAgent } from "@/app/_lib/data-service"

// Predefined options for better UX
const PLATFORM_OPTIONS = [
  { value: "website", label: "Website Application" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
]

const TONE_OPTIONS = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "consultative", label: "Consultative" },
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "calm", label: "Calm" },
  { value: "humorous", label: "Humorous" },
  { value: "serious", label: "Serious" },
  { value: "helpful", label: "Helpful" },
  { value: "authoritative", label: "Authoritative" }
]

const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance & Banking" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "real-estate", label: "Real Estate" },
  { value: "automotive", label: "Automotive" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "consulting", label: "Consulting" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "legal", label: "Legal Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "non-profit", label: "Non-profit" },
  { value: "other", label: "Other" }
]

interface AgentFormData {
  name: string
  description: string
  platforms: string[]
  tone: string
  website: string
  industry: string
  target_audience: string
  goal: string
}

export function CreateAgentForm() {
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    description: "",
    platforms: [],
    tone: "",
    website: "",
    industry: "",
    target_audience: "",
    goal: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof AgentFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (!formData.name.trim()) errors.push("Agent name is required")
    if (!formData.description.trim()) errors.push("Description is required")
    if (formData.platforms.length === 0) errors.push("At least one platform must be selected")
    if (!formData.tone) errors.push("Communication tone is required")
    if (!formData.industry) errors.push("Industry is required")
    if (!formData.target_audience.trim()) errors.push("Target audience is required")
    if (!formData.goal.trim()) errors.push("Primary goal is required")
    
    return { valid: errors.length === 0, errors }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateForm()
    if (!validation.valid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(", "),
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for submission
      const formDataToSubmit: any = new FormData()
      
      // Add agent details
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSubmit.append(key, JSON.stringify(value))

        } else {
          formDataToSubmit.append(key, JSON.stringify(value))
        }
      })

      
      // console.log(formDataToSubmit, "formDataToSubmit2")
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

    
console.log("formData",formData)
const {data:responseData} = await createAIAgent(formData)
const {data:agentData}= responseData
const {agent}= agentData
      toast({
  title: "Success!",
  description: "Your AI agent has been created successfully",
      })
      // Reset form
      setFormData({
        name: "",
        description: "",
        platforms: [],
        tone: "",
        website: "",
        industry: "",
        target_audience: "",
        goal: ""
      })

    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create agent. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create Your AI Agent</h1>
        <p className="text-muted-foreground">
          Build a personalized AI agent that matches your business needs and communication style
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agent Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>Agent Identity</span>
            </CardTitle>
            <CardDescription>
              Define your AI agent's basic information and personality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., SalesBot Pro, CustomerCare AI"
                className="w-full"
              />
              <p className="text-sm text-gray-500">Choose a memorable name for your AI agent</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">What does your agent do? *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your agent's purpose, capabilities, and what problems it solves..."
                rows={3}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Explain your agent's role and responsibilities</p>
            </div>
          </CardContent>
        </Card>

        {/* Communication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span>Communication Style</span>
            </CardTitle>
            <CardDescription>
              Configure how your agent communicates with customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Communication Tone *</Label>
              <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Choose how your agent should sound when interacting with customers</p>
              </div>

            <div className="space-y-2">
              <Label htmlFor="target-audience">Who is your target audience? *</Label>
              <Textarea
                id="target-audience"
                value={formData.target_audience}
                onChange={(e) => handleInputChange("target_audience", e.target.value)}
                placeholder="e.g., Small business owners aged 25-45, Tech-savvy professionals, Enterprise decision makers..."
                rows={2}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Describe your ideal customers or users</p>
            </div>
          </CardContent>
        </Card>

        {/* Business Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span>Business Context</span>
            </CardTitle>
            <CardDescription>
              Provide context about your business and industry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">This helps your agent understand industry-specific terminology</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Your Website URL</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full"
              />
              <p className="text-sm text-gray-500">Optional: Helps your agent reference your website content</p>
            </div>
          </CardContent>
        </Card>

        {/* Platforms & Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span>Platforms & Goals</span>
            </CardTitle>
            <CardDescription>
              Choose where your agent will operate and what it should achieve
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                <div className="space-y-2">
              <Label>Where will your agent operate? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PLATFORM_OPTIONS.map((platform) => (
                      <Button
                    key={platform.value}
                    type="button"
                    variant={formData.platforms.includes(platform.value) ? "default" : "outline"}
                        size="sm"
                    onClick={() => togglePlatform(platform.value)}
                    className="justify-start"
                      >
                    {platform.label}
                      </Button>
                  ))}
              </div>
              <p className="text-sm text-gray-500">Select all platforms where your agent will be active</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">What's your primary goal? *</Label>
              <Textarea
                id="goal"
                value={formData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                placeholder="e.g., Increase sales by 30%, Reduce support tickets by 50%, Generate 100 qualified leads per month..."
                rows={2}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Define the main objective your agent should achieve</p>
            </div>
          </CardContent>
        </Card>



        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Your AI Agent...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Create AI Agent
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your agent will be ready to configure and deploy
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
