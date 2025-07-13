"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Bot,
  Eye,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Conversation {
  id: string
  customerName: string
  customerEmail: string
  agentName: string
  agentId: string
  channel: "chat" | "phone" | "email"
  status: "active" | "completed" | "pending" | "failed" | "waiting"
  startTime: string
  endTime?: string
  duration: string
  messageCount: number
  outcome: "converted" | "qualified" | "follow-up" | "no-interest" | "ongoing"
  lastMessage: string
  customerSentiment: "positive" | "neutral" | "negative"
  priority: "high" | "medium" | "low"
  source: string
}

const mockConversations: Conversation[] = [
  {
    id: "conv_001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@techcorp.com",
    agentName: "Sales Agent Pro",
    agentId: "1",
    channel: "chat",
    status: "completed",
    startTime: "2024-01-20T10:30:00Z",
    endTime: "2024-01-20T10:45:00Z",
    duration: "15m",
    messageCount: 23,
    outcome: "converted",
    lastMessage: "Perfect! I'll send you the contract details via email.",
    customerSentiment: "positive",
    priority: "high",
    source: "Website Chat",
  },
  {
    id: "conv_002",
    customerName: "Michael Chen",
    customerEmail: "m.chen@startup.io",
    agentName: "Sales Agent Pro",
    agentId: "1",
    channel: "phone",
    status: "active",
    startTime: "2024-01-20T14:20:00Z",
    duration: "8m",
    messageCount: 12,
    outcome: "ongoing",
    lastMessage: "Let me check our enterprise pricing options for you.",
    customerSentiment: "positive",
    priority: "high",
    source: "Contact Form",
  },
  {
    id: "conv_003",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@marketing.com",
    agentName: "Support Assistant",
    agentId: "2",
    channel: "chat",
    status: "completed",
    startTime: "2024-01-20T09:15:00Z",
    endTime: "2024-01-20T09:35:00Z",
    duration: "20m",
    messageCount: 31,
    outcome: "qualified",
    lastMessage: "I'll schedule a demo for next Tuesday at 2 PM.",
    customerSentiment: "positive",
    priority: "medium",
    source: "Email",
  },
  {
    id: "conv_004",
    customerName: "David Wilson",
    customerEmail: "david@consulting.biz",
    agentName: "Sales Agent Pro",
    agentId: "1",
    channel: "email",
    status: "pending",
    startTime: "2024-01-20T16:45:00Z",
    duration: "2m",
    messageCount: 3,
    outcome: "follow-up",
    lastMessage: "I need to discuss this with my team first.",
    customerSentiment: "neutral",
    priority: "medium",
    source: "Website Chat",
  },
  {
    id: "conv_005",
    customerName: "Lisa Thompson",
    customerEmail: "lisa.t@enterprise.com",
    agentName: "Sales Agent Pro",
    agentId: "1",
    channel: "chat",
    status: "completed",
    startTime: "2024-01-20T11:00:00Z",
    endTime: "2024-01-20T11:25:00Z",
    duration: "25m",
    messageCount: 42,
    outcome: "no-interest",
    lastMessage: "Thanks for the information, but we're not ready to make changes right now.",
    customerSentiment: "neutral",
    priority: "low",
    source: "Contact Form",
  },
  {
    id: "conv_006",
    customerName: "James Parker",
    customerEmail: "j.parker@tech.startup",
    agentName: "Support Assistant",
    agentId: "2",
    channel: "phone",
    status: "failed",
    startTime: "2024-01-20T13:30:00Z",
    endTime: "2024-01-20T13:32:00Z",
    duration: "2m",
    messageCount: 2,
    outcome: "follow-up",
    lastMessage: "Connection lost during call.",
    customerSentiment: "neutral",
    priority: "medium",
    source: "Email",
  },
  {
    id: "1",
    customerName: "John Smith",
    customerEmail: "",
    agentName: "Product Demo Agent",
    agentId: "",
    channel: "",
    status: "active",
    startTime: "",
    endTime: "",
    duration: "",
    messageCount: 12,
    outcome: "",
    lastMessage: "I'm interested in the premium plan features",
    customerSentiment: "",
    priority: "",
    source: "Website Chat",
  },
  {
    id: "2",
    customerName: "Sarah Johnson",
    customerEmail: "",
    agentName: "Lead Qualifier",
    agentId: "",
    channel: "",
    status: "completed",
    startTime: "",
    endTime: "",
    duration: "",
    messageCount: 8,
    outcome: "",
    lastMessage: "Thank you for the information. I'll be in touch.",
    customerSentiment: "",
    priority: "",
    source: "Contact Form",
  },
  {
    id: "3",
    customerName: "Mike Davis",
    customerEmail: "",
    agentName: "Support Assistant",
    agentId: "",
    channel: "",
    status: "waiting",
    startTime: "",
    endTime: "",
    duration: "",
    messageCount: 5,
    outcome: "",
    lastMessage: "Can you help me with the integration setup?",
    customerSentiment: "",
    priority: "",
    source: "Email",
  },
  {
    id: "4",
    customerName: "Emily Chen",
    customerEmail: "",
    agentName: "Pricing Specialist",
    agentId: "",
    channel: "",
    status: "active",
    startTime: "",
    endTime: "",
    duration: "",
    messageCount: 15,
    outcome: "",
    lastMessage: "What's included in the enterprise package?",
    customerSentiment: "",
    priority: "",
    source: "Website Chat",
  },
]

const getConversationMessages = (conversationId: string) => {
  // Mock conversation messages - in real app, this would come from API
  const messagesByConversation: Record<string, any[]> = {
    conv_001: [
      {
        id: 1,
        sender: "customer",
        message: "Hi, I'm interested in your sales automation platform.",
        timestamp: "2024-01-20T10:30:00Z",
      },
      {
        id: 2,
        sender: "agent",
        message:
          "Hello Sarah! I'd be happy to help you learn about our AI sales automation platform. What specific challenges are you looking to solve?",
        timestamp: "2024-01-20T10:30:30Z",
      },
      {
        id: 3,
        sender: "customer",
        message: "We're struggling with lead qualification and follow-ups. Our sales team is overwhelmed.",
        timestamp: "2024-01-20T10:31:00Z",
      },
      {
        id: 4,
        sender: "agent",
        message:
          "That's exactly what our platform excels at! Our AI agents can automatically qualify leads based on your criteria and handle follow-ups 24/7. Would you like to see how this works?",
        timestamp: "2024-01-20T10:31:45Z",
      },
      {
        id: 5,
        sender: "customer",
        message: "Yes, that sounds perfect. Can you show me some examples?",
        timestamp: "2024-01-20T10:32:15Z",
      },
      {
        id: 6,
        sender: "agent",
        message:
          "Absolutely! Let me walk you through our lead qualification process. Our AI can score leads based on company size, budget, timeline, and decision-making authority.",
        timestamp: "2024-01-20T10:33:00Z",
      },
      { id: 7, sender: "customer", message: "How accurate is the lead scoring?", timestamp: "2024-01-20T10:34:00Z" },
      {
        id: 8,
        sender: "agent",
        message:
          "Our clients typically see 85-92% accuracy in lead qualification, which means your sales team only focuses on the most promising prospects.",
        timestamp: "2024-01-20T10:34:30Z",
      },
      {
        id: 9,
        sender: "customer",
        message: "That's impressive. What about pricing?",
        timestamp: "2024-01-20T10:35:00Z",
      },
      {
        id: 10,
        sender: "agent",
        message:
          "Our pricing starts at $299/month for up to 1,000 leads processed. For your company size, I'd recommend our Professional plan at $599/month. This includes unlimited lead processing and 3 AI agents.",
        timestamp: "2024-01-20T10:36:00Z",
      },
      {
        id: 11,
        sender: "customer",
        message: "That fits our budget. How quickly can we get started?",
        timestamp: "2024-01-20T10:37:00Z",
      },
      {
        id: 12,
        sender: "agent",
        message:
          "We can have you up and running within 48 hours! I'll send you our onboarding checklist and contract details. Would you like to schedule a setup call for tomorrow?",
        timestamp: "2024-01-20T10:38:00Z",
      },
      {
        id: 13,
        sender: "customer",
        message: "Perfect! I'll send you the contract details via email.",
        timestamp: "2024-01-20T10:45:00Z",
      },
    ],
    conv_002: [
      {
        id: 1,
        sender: "customer",
        message: "Hello, I'm calling about your enterprise solutions.",
        timestamp: "2024-01-20T14:20:00Z",
      },
      {
        id: 2,
        sender: "agent",
        message:
          "Hi Michael! Thanks for calling. I'd be happy to discuss our enterprise solutions. What's your company's current situation?",
        timestamp: "2024-01-20T14:20:30Z",
      },
      {
        id: 3,
        sender: "customer",
        message: "We're a 500-person startup and need to scale our sales operations quickly.",
        timestamp: "2024-01-20T14:21:00Z",
      },
      {
        id: 4,
        sender: "agent",
        message:
          "Perfect timing! Our enterprise solution is designed exactly for companies like yours. Let me check our enterprise pricing options for you.",
        timestamp: "2024-01-20T14:22:00Z",
      },
    ],
    "1": [
      {
        id: 1,
        sender: "customer",
        message: "Hello, I'm interested in your premium plan features.",
        timestamp: "2024-01-20T12:00:00Z",
      },
      {
        id: 2,
        sender: "agent",
        message:
          "Hi John! Our premium plan includes advanced features like custom workflows and AI-driven analytics. Would you like to learn more?",
        timestamp: "2024-01-20T12:01:00Z",
      },
    ],
    "2": [
      {
        id: 1,
        sender: "customer",
        message: "Thank you for the information.",
        timestamp: "2024-01-20T10:00:00Z",
      },
      {
        id: 2,
        sender: "agent",
        message: "You're welcome! I'll be in touch soon.",
        timestamp: "2024-01-20T10:01:00Z",
      },
    ],
    "3": [
      {
        id: 1,
        sender: "customer",
        message: "Can you help me with the integration setup?",
        timestamp: "2024-01-19T12:00:00Z",
      },
      {
        id: 2,
        sender: "agent",
        message: "Of course! Let's go through the steps together.",
        timestamp: "2024-01-19T12:01:00Z",
      },
    ],
    "4": [
      {
        id: 1,
        sender: "customer",
        message: "Hello, I'm interested in your enterprise package.",
        timestamp: "2024-01-20T11:00:00Z",
      },
      {
        id: 2,
        sender: "agent",
        message: "Great! Our enterprise package includes everything you need for large-scale operations.",
        timestamp: "2024-01-20T11:01:00Z",
      },
    ],
  }

  return messagesByConversation[conversationId] || []
}

export function ConversationsOverview() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [agents, setAgents] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false)

  useEffect(() => {
    // Load agents
    const userAgents = JSON.parse(localStorage.getItem("userAgents") || "[]")
    const defaultAgents = [
      { id: 1, name: "Sales Agent Pro" },
      { id: 2, name: "Support Assistant" },
      { id: 3, name: "Product Demo Agent" },
      { id: 4, name: "Lead Qualifier" },
      { id: 5, name: "Pricing Specialist" },
    ]
    const allAgents = [...defaultAgents, ...userAgents]
    setAgents(allAgents)
  }, [])

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAgent = selectedAgent === "all" || conv.agentId === selectedAgent
    const matchesStatus = selectedStatus === "all" || conv.status === selectedStatus
    const matchesChannel = selectedChannel === "all" || conv.channel === selectedChannel

    return matchesSearch && matchesAgent && matchesStatus && matchesChannel
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "converted":
        return "bg-green-100 text-green-800"
      case "qualified":
        return "bg-blue-100 text-blue-800"
      case "follow-up":
        return "bg-yellow-100 text-yellow-800"
      case "no-interest":
        return "bg-gray-100 text-gray-800"
      case "ongoing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-gray-100 text-gray-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "chat":
        return <MessageSquare className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString()
  }

  const handleViewConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      setSelectedConversation(conversation)
      setIsConversationModalOpen(true)
    }
  }

  const handleRefreshConversations = () => {
    // Simulate refreshing conversations
    alert("Refreshing conversations... In a real app, this would fetch latest data from the server.")
  }

  const handleExportConversations = () => {
    alert("Exporting conversations... In a real app, this would generate a CSV/PDF export.")
  }

  // Calculate statistics
  const stats = {
    total: conversations.length,
    active: conversations.filter((c) => c.status === "active").length,
    completed: conversations.filter((c) => c.status === "completed").length,
    converted: conversations.filter((c) => c.outcome === "converted").length,
    conversionRate: Math.round(
      (conversations.filter((c) => c.outcome === "converted").length / conversations.length) * 100,
    ),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
          <p className="text-gray-600">Monitor and analyze all customer interactions with your AI agents</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRefreshConversations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportConversations}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-gray-500">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-gray-500">Finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.converted}</div>
            <p className="text-xs text-gray-500">Sales closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-gray-500">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Conversations ({filteredConversations.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({filteredConversations.filter((c) => c.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredConversations.filter((c) => c.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="converted">
            Converted ({filteredConversations.filter((c) => c.outcome === "converted").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>All customer interactions with your AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredConversations.length > 0 ? (
                <div className="space-y-4">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {conversation.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{conversation.customerName}</h3>
                            <Badge className={getStatusColor(conversation.status)}>{conversation.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center space-x-1">
                              {getChannelIcon(conversation.channel)}
                              <span>{conversation.channel}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Bot className="h-4 w-4" />
                              <span>{conversation.agentName}</span>
                            </span>
                            <span>{conversation.duration}</span>
                            <span>{conversation.messageCount} messages</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate max-w-md">{conversation.lastMessage}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getSentimentColor(conversation.customerSentiment)}>
                          {conversation.customerSentiment}
                        </Badge>
                        <div className="text-right text-sm text-gray-500">
                          <div>{conversation.startTime}</div>
                          {conversation.endTime && <div className="text-xs">Ended: {conversation.endTime}</div>}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedAgent !== "all" || selectedStatus !== "all" || selectedChannel !== "all"
                      ? "Try adjusting your filters to see more conversations."
                      : "Your AI agents haven't started any conversations yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Conversations</CardTitle>
              <CardDescription>Conversations currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredConversations
                  .filter((c) => c.status === "active")
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer border-green-200 bg-green-50"
                      onClick={() => handleViewConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <Avatar>
                          <AvatarFallback>
                            {conversation.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{conversation.customerName}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              {getChannelIcon(conversation.channel)}
                              <span>{conversation.channel}</span>
                            </span>
                            <span>•</span>
                            <span>{conversation.agentName}</span>
                            <span>•</span>
                            <span>{conversation.duration} elapsed</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{conversation.lastMessage}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Monitor
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Conversations</CardTitle>
              <CardDescription>Finished customer interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredConversations
                  .filter((c) => c.status === "completed")
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <Avatar>
                          <AvatarFallback>
                            {conversation.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{conversation.customerName}</h3>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{conversation.duration}</span>
                            <span>•</span>
                            <span>{conversation.messageCount} messages</span>
                            <span>•</span>
                            <span>{conversation.agentName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Completed</div>
                        <div>{conversation.endTime}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Successful Conversions</CardTitle>
              <CardDescription>Conversations that resulted in sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredConversations
                  .filter((c) => c.outcome === "converted")
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer border-green-200 bg-green-50"
                      onClick={() => handleViewConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <Avatar>
                          <AvatarFallback>
                            {conversation.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{conversation.customerName}</h3>
                            <Badge className="bg-green-100 text-green-800">Converted</Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{conversation.duration}</span>
                            <span>•</span>
                            <span>{conversation.agentName}</span>
                            <span>•</span>
                            <span>{conversation.endTime}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Conversation Detail Modal */}
      <Dialog open={isConversationModalOpen} onOpenChange={setIsConversationModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          {selectedConversation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConversation.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{selectedConversation.customerName}</span>
                      <Badge className={getStatusColor(selectedConversation.status)}>
                        {selectedConversation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 font-normal">{selectedConversation.customerEmail}</div>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      {getChannelIcon(selectedConversation.channel)}
                      <span className="capitalize">{selectedConversation.channel}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Bot className="h-4 w-4" />
                      <span>{selectedConversation.agentName}</span>
                    </span>
                    <span>Duration: {selectedConversation.duration}</span>
                    <span>Messages: {selectedConversation.messageCount}</span>
                    <span>Source: {selectedConversation.source}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversation Messages */}
                <div className="lg:col-span-2">
                  <div className="space-y-2 mb-4">
                    <h3 className="font-semibold">Conversation History</h3>
                    <p className="text-sm text-gray-500">
                      Started: {selectedConversation.startTime}
                      {selectedConversation.endTime && <span> • Ended: {selectedConversation.endTime}</span>}
                    </p>
                  </div>

                  <ScrollArea className="h-96 border rounded-lg p-4">
                    <div className="space-y-4">
                      {getConversationMessages(selectedConversation.id).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === "agent" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div className="text-sm">{message.message}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.sender === "agent" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Conversation Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Conversation Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge className={getStatusColor(selectedConversation.status)}>
                          {selectedConversation.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Channel:</span>
                        <span className="flex items-center space-x-1">
                          {getChannelIcon(selectedConversation.channel)}
                          <span className="capitalize">{selectedConversation.channel}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Agent:</span>
                        <span>{selectedConversation.agentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Source:</span>
                        <span>{selectedConversation.source}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Customer Info</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <div className="font-medium">{selectedConversation.customerName}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <div className="font-medium">{selectedConversation.customerEmail}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Follow-up Email
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Schedule Call
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Export Conversation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
