"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, MessageSquare, Users, TrendingUp, Plus, Activity } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardOverview() {
  const router = useRouter()

  const stats = [
    {
      title: "Active Agents",
      value: "12",
      description: "+2 from last month",
      icon: Bot,
      color: "text-blue-600",
    },
    {
      title: "Conversations",
      value: "1,234",
      description: "+15% from last month",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Leads Generated",
      value: "89",
      description: "+23% from last month",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Conversion Rate",
      value: "12.5%",
      description: "+2.1% from last month",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "conversation",
      message: "New conversation started with lead from website",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "agent",
      message: "Sales Agent 'Product Demo' was updated",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "lead",
      message: "Lead qualified and assigned to sales team",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "training",
      message: "New training content uploaded successfully",
      time: "2 hours ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your AI agents.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/agents/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/dashboard/agents/create")}
            >
              <Bot className="h-4 w-4 mr-2" />
              Create New AI Agent
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/dashboard/training")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Training Content
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/dashboard/conversations")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Conversations
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/dashboard/reports")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
