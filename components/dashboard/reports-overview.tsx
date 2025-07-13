"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, MessageSquare, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReportsOverview() {
  const performanceData = [
    { metric: "Total Conversations", value: "2,456", change: "+12.5%", trend: "up" },
    { metric: "Conversion Rate", value: "18.3%", change: "+2.1%", trend: "up" },
    { metric: "Average Response Time", value: "1.2s", change: "-0.3s", trend: "up" },
    { metric: "Customer Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" },
  ]

  const agentPerformance = [
    { name: "Product Demo Agent", conversations: 456, conversions: 89, rate: "19.5%" },
    { name: "Lead Qualifier", conversations: 789, conversions: 142, rate: "18.0%" },
    { name: "Support Assistant", conversations: 234, conversions: 38, rate: "16.2%" },
    { name: "Pricing Specialist", conversations: 345, conversions: 67, rate: "19.4%" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track performance and analyze your AI agents' effectiveness</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((item) => (
              <Card key={item.metric}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="text-xs text-green-600">{item.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Trends</CardTitle>
                <CardDescription>Daily conversation volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead progression through sales stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Funnel chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Comparison</CardTitle>
              <CardDescription>Compare the effectiveness of your AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentPerformance.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-sm text-gray-600">
                          {agent.conversations} conversations • {agent.conversions} conversions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{agent.rate}</div>
                      <p className="text-xs text-gray-500">Conversion Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,456</div>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.2 min</div>
                <p className="text-sm text-green-600">+0.3 min from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">87.3%</div>
                <p className="text-sm text-green-600">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Generated</CardTitle>
                <CardDescription>Total revenue attributed to AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$45,230</div>
                <p className="text-sm text-green-600">+18.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Deal Size</CardTitle>
                <CardDescription>Average value per converted lead</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,250</div>
                <p className="text-sm text-green-600">+5.3% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
