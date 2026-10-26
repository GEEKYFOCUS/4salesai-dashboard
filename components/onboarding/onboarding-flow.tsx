"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bot, CheckCircle } from "lucide-react"
import { WelcomeStep } from "./welcome-step"
import { BusinessInfoStep } from "./business-info-step"
import { AgentSetupStep } from "./agent-setup-step"
import { CompletionStep } from "./completion-step"

const steps = [
  { id: 1, title: "Welcome", component: WelcomeStep },
  { id: 2, title: "Business Info", component: BusinessInfoStep },
  { id: 3, title: "Create Agent", component: AgentSetupStep },
  { id: 4, title: "Complete", component: CompletionStep },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const router = useRouter()

  const handleNext = (data?: any) => {
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }))
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = steps[currentStep - 1].component
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">4SalesAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Let's set up your first AI Sales Agent</h1>
          <p className="text-gray-600">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      currentStep === step.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}
                  />
                )}
                <span className="ml-1">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <Card className="shadow-lg border-0">
          <CurrentStepComponent
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            canGoBack={currentStep > 1}
          />
        </Card>
      </div>
    </div>
  )
}
