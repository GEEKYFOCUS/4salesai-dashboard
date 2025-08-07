"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Bot, Upload, BarChart3 } from "lucide-react"

interface CompletionStepProps {
  onNext: () => void
  onBack: () => void
  canGoBack: boolean
  formData: any
}

export function CompletionStep({ onNext, formData }: CompletionStepProps) {
  console.log(formData, "last form data")
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center space-x-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <span>Setup Complete!</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Congratulations! Your AI Sales Agent "{formData.companyName}" has been created successfully.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Upload className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Upload Training Content</h4>
                <p className="text-sm text-green-700">Add videos, documents, and URLs to train your agent</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Bot className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Test Your Agent</h4>
                <p className="text-sm text-green-700">Try conversations and refine responses</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Monitor Performance</h4>
                <p className="text-sm text-green-700">Track conversations and optimize results</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">   
          <Button onClick={()=>onNext()} size="lg" className="px-8">
            Go to Dashboard
          </Button>
        </div>
      </CardContent>
    </>
  )
}
