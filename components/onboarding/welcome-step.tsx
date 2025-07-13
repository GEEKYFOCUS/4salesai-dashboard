"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, MessageSquare, TrendingUp, Users } from "lucide-react"

interface WelcomeStepProps {
  onNext: () => void
  onBack: () => void
  canGoBack: boolean
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">Welcome to 4SalesAI!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            You're about to create your first AI Sales Agent. Here's what you can expect:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <Bot className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">AI-Powered Conversations</h3>
              <p className="text-sm text-gray-600">Your agent will handle customer interactions naturally</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <MessageSquare className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">24/7 Availability</h3>
              <p className="text-sm text-gray-600">Never miss a lead, even while you sleep</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Performance Tracking</h3>
              <p className="text-sm text-gray-600">Monitor conversions and optimize results</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
            <Users className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Lead Management</h3>
              <p className="text-sm text-gray-600">Automatically qualify and nurture prospects</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={onNext} size="lg" className="px-8">
            Get Started
          </Button>
        </div>
      </CardContent>
    </>
  )
}
