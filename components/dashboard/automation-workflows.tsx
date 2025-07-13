"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  Clock,
  MessageSquare,
  Phone,
  Users,
  Calendar,
  Target,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  trigger: "new_lead" | "time_based" | "conversation_end" | "no_response" | "keyword_detected"
  actions: AutomationAction[]
  conditions: AutomationCondition[]
  status: "active" | "paused" | "draft"
  agentId: string
  agentName: string
  createdAt: string
  lastRun?: string
  totalRuns: number
  successRate: number
  type: string
  triggers: number
  completions: number
}

interface AutomationAction {
  id: string
  type: "send_message" | "make_call" | "send_email" | "schedule_followup" | "assign_lead" | "update_status"
  config: any
  delay?: number
}

interface AutomationCondition {
  id: string
  field: "lead_score" | "company_size" | "industry" | "response_time" | "sentiment"
  operator: "equals" | "greater_than" | "less_than" | "contains"
  value: string
}

const mockWorkflows: AutomationWorkflow[] = [
  {
    id: "wf_001",
    name: "New Lead Welcome Sequence",
    description: "Automatically welcome new leads and qualify them",
    trigger: "new_lead",
    actions: [
      { id: "a1", type: "send_message", config: { message: "Welcome! Thanks for your interest." }, delay: 0 },
      { id: "a2", type: "send_message", config: { message: "What brings you to our platform today?" }, delay: 30 },
    ],
    conditions: [{ id: "c1", field: "lead_score", operator: "greater_than", value: "5" }],
    status: "active",
    agentId: "1",
    agentName: "Sales Agent Pro",
    createdAt: "2024-01-15",
    lastRun: "2024-01-20T10:30:00Z",
    totalRuns: 156,
    successRate: 87,
    type: "email",
    triggers: 45,
    completions: 38,
  },
  {
    id: "wf_002",
    name: "Follow-up Reminder",
    description: "Send follow-up messages to prospects who haven't responded",
    trigger: "no_response",
    actions: [
      { id: "a1", type: "send_message", config: { message: "Just following up on our conversation..." }, delay: 0 },
      { id: "a2", type: "schedule_followup", config: { days: 3 }, delay: 0 },
    ],
    conditions: [{ id: "c1", field: "response_time", operator: "greater_than", value: "24" }],
    status: "active",
    agentId: "1",
    agentName: "Sales Agent Pro",
    createdAt: "2024-01-10",
    lastRun: "2024-01-20T14:20:00Z",
    totalRuns: 89,
    successRate: 72,
    type: "call",
    triggers: 23,
    completions: 18,
  },
  {
    id: "wf_003",
    name: "High-Value Lead Alert",
    description: "Notify team when high-value leads are detected",
    trigger: "keyword_detected",
    actions: [
      { id: "a1", type: "assign_lead", config: { assignTo: "sales_manager" }, delay: 0 },
      { id: "a2", type: "send_email", config: { template: "high_value_alert" }, delay: 5 },
    ],
    conditions: [
      { id: "c1", field: "company_size", operator: "greater_than", value: "500" },
      { id: "c2", field: "lead_score", operator: "greater_than", value: "8" },
    ],
    status: "active",
    agentId: "2",
    agentName: "Support Assistant",
    createdAt: "2024-01-05",
    lastRun: "2024-01-19T16:45:00Z",
    totalRuns: 23,
    successRate: 95,
    type: "scheduling",
    triggers: 12,
    completions: 9,
  },
  {
    id: "wf_004",
    name: "Demo Scheduling",
    description: "Automatically schedule demos for qualified leads",
    trigger: "conversation_end",
    actions: [
      { id: "a1", type: "send_message", config: { message: "Would you like to schedule a demo?" }, delay: 0 },
      { id: "a2", type: "schedule_followup", config: { days: 1 }, delay: 60 },
    ],
    conditions: [{ id: "c1", field: "sentiment", operator: "equals", value: "positive" }],
    status: "paused",
    agentId: "1",
    agentName: "Sales Agent Pro",
    createdAt: "2024-01-12",
    totalRuns: 45,
    successRate: 68,
    type: "scheduling",
    triggers: 12,
    completions: 9,
  },
]

export function AutomationWorkflows() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(mockWorkflows)
  const [agents, setAgents] = useState<any[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    // Load agents
    const userAgents = JSON.parse(localStorage.getItem("userAgents") || "[]")
    const defaultAgents = [
      { id: 1, name: "Sales Agent Pro" },
      { id: 2, name: "Support Assistant" },
    ]
    const allAgents = [...defaultAgents, ...userAgents]
    setAgents(allAgents)
  }, [])

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAgent = selectedAgent === "all" || workflow.agentId === selectedAgent
    const matchesStatus = selectedStatus === "all" || workflow.status === selectedStatus

    return matchesSearch && matchesAgent && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "new_lead":
        return <Users className="h-4 w-4" />
      case "time_based":
        return <Clock className="h-4 w-4" />
      case "conversation_end":
        return <MessageSquare className="h-4 w-4" />
      case "no_response":
        return <Clock className="h-4 w-4" />
      case "keyword_detected":
        return <Target className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "scheduling":
        return <Calendar className="h-4 w-4" />
      default:
        return <Phone className="h-4 w-4" />
    }
  }

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(
      workflows.map((w) => (w.id === workflowId ? { ...w, status: w.status === "active" ? "paused" : "active" } : w)),
    )
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      setWorkflows(workflows.filter((w) => w.id !== workflowId))
    }
  }

  const handleDuplicateWorkflow = (workflow: AutomationWorkflow) => {
    const newWorkflow = {
      ...workflow,
      id: `wf_${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      status: "draft" as const,
      createdAt: new Date().toISOString().split("T")[0],
      totalRuns: 0,
      successRate: 0,
    }
    setWorkflows([...workflows, newWorkflow])
  }

  const stats = {
    total: workflows.length,
    active: workflows.filter((w) => w.status === "active").length,
    totalTriggers: workflows.reduce((sum, w) => sum + w.triggers, 0),
    totalCompletions: workflows.reduce((sum, w) => sum + w.completions, 0),
    avgSuccessRate: Math.round(
      workflows.reduce((sum, w) => sum + (w.completions / w.triggers) * 100, 0) / workflows.length,
    ),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600">Manage your automated workflows and sequences</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Triggers</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTriggers}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompletions}</div>
            <p className="text-xs text-muted-foreground">67% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Settings className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(workflow.type)}
                  <div>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedWorkflow(workflow)
                        setIsEditModalOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Workflow
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateWorkflow(workflow)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleWorkflow(workflow.id)}>
                      {workflow.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Workflow
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate Workflow
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteWorkflow(workflow.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Triggers:</span>
                  <span className="font-medium">{workflow.triggers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completions:</span>
                  <span className="font-medium">{workflow.completions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium">{Math.round((workflow.completions / workflow.triggers) * 100)}%</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleToggleWorkflow(workflow.id)}
                  >
                    {workflow.status === "active" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedAgent !== "all" || selectedStatus !== "all"
                ? "Try adjusting your filters to see more workflows."
                : "Create your first automation workflow to get started."}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Workflow Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>Set up an automated workflow for your AI agents</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input id="workflow-name" placeholder="e.g., Welcome New Leads" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow-agent">Agent</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea id="workflow-description" placeholder="Describe what this workflow does..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-trigger">Trigger</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_lead">New Lead</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                  <SelectItem value="conversation_end">Conversation End</SelectItem>
                  <SelectItem value="no_response">No Response</SelectItem>
                  <SelectItem value="keyword_detected">Keyword Detected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateModalOpen(false)}>Create Workflow</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
