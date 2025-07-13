"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Search, MessageSquare, Book, Mail, Phone, ChevronDown, ChevronRight, Send } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const faqItems = [
    {
      id: "1",
      question: "How do I create my first AI agent?",
      answer:
        "To create your first AI agent, navigate to the AI Agents page and click 'Create Agent'. Follow the setup wizard to configure your agent's personality, knowledge base, and conversation flows.",
      category: "Getting Started",
    },
    {
      id: "2",
      question: "What types of content can I upload for training?",
      answer:
        "You can upload various types of content including PDFs, Word documents, text files, videos, and web URLs. Our system will process and extract relevant information to train your AI agents.",
      category: "Training",
    },
    {
      id: "3",
      question: "How do I integrate with my existing CRM?",
      answer:
        "4SalesAI supports integration with popular CRMs like Salesforce, HubSpot, and Pipedrive. Go to Settings > Integrations to connect your CRM and sync lead data automatically.",
      category: "Integrations",
    },
    {
      id: "4",
      question: "Can I customize the conversation flows?",
      answer:
        "Yes! You can create custom conversation flows using our visual flow builder. Define different paths based on user responses and create personalized experiences for your prospects.",
      category: "Customization",
    },
    {
      id: "5",
      question: "How is my data protected?",
      answer:
        "We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is stored securely and never shared with third parties.",
      category: "Security",
    },
  ]

  const tutorials = [
    {
      title: "Getting Started with 4SalesAI",
      description: "Complete beginner's guide to setting up your first AI agent",
      duration: "10 min",
      type: "Video",
    },
    {
      title: "Advanced Agent Configuration",
      description: "Learn how to create sophisticated conversation flows",
      duration: "15 min",
      type: "Article",
    },
    {
      title: "CRM Integration Setup",
      description: "Step-by-step guide to connecting your CRM",
      duration: "8 min",
      type: "Video",
    },
    {
      title: "Analytics and Reporting",
      description: "Understanding your agent performance metrics",
      duration: "12 min",
      type: "Article",
    },
  ]

  const tickets = [
    {
      id: "TICK-001",
      subject: "Agent not responding to certain keywords",
      status: "open",
      priority: "high",
      created: "2 hours ago",
    },
    {
      id: "TICK-002",
      subject: "Integration with Salesforce failing",
      status: "in-progress",
      priority: "medium",
      created: "1 day ago",
    },
    {
      id: "TICK-003",
      subject: "Request for custom training data format",
      status: "resolved",
      priority: "low",
      created: "3 days ago",
    },
  ]

  const filteredFAQ = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Find answers, tutorials, and get help when you need it</p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="space-y-4">
                {filteredFAQ.map((item) => (
                  <Collapsible
                    key={item.id}
                    open={openFAQ === item.id}
                    onOpenChange={() => setOpenFAQ(openFAQ === item.id ? null : item.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-4 h-auto text-left">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-0.5">
                            {item.category}
                          </Badge>
                          <span className="font-medium">{item.question}</span>
                        </div>
                        {openFAQ === item.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Tutorials & Guides
              </CardTitle>
              <CardDescription>Step-by-step guides to help you get the most out of 4SalesAI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline">{tutorial.type}</Badge>
                        <span className="text-sm text-gray-500">{tutorial.duration}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tutorial.description}</p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Start Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="flex items-center justify-between">
            <Card className="flex-1 mr-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Support Tickets
                </CardTitle>
                <CardDescription>Track and manage your support requests</CardDescription>
              </CardHeader>
            </Card>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{ticket.id}</span>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500">Created {ticket.created}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Brief description of your issue" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Describe your issue in detail..." rows={4} />
                </div>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
                <CardDescription>Alternative contact methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@4salesai.com</p>
                    <p className="text-xs text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600">Available in-app</p>
                    <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
