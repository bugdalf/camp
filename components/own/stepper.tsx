'use client'

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <div key={step.id} className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border text-sm font-medium transition",
                  isCompleted && "bg-primary text-primary-foreground border-primary",
                  isActive && "border-primary text-primary",
                  !isCompleted && !isActive && "border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span className="mt-2 text-xs text-center">{step.label}</span>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-2",
                  step.id < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
