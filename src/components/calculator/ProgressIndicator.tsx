"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
}

const steps = [
  { number: 1, title: "Company Profile", description: "Tell us about your organization" },
  { number: 2, title: "Integration Needs", description: "Define your requirements" },
  { number: 3, title: "Current Costs", description: "Optional: Your existing spend" },
] as const;

export function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li key={step.number} className="relative flex-1">
              {index !== 0 && (
                <div
                  className="absolute left-0 top-4 -translate-y-1/2 h-0.5 w-full -translate-x-1/2 bg-muted"
                  aria-hidden="true"
                >
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => onStepClick?.(step.number)}
                disabled={!onStepClick || currentStep < step.number}
                className={cn(
                  "group relative flex flex-col items-center",
                  onStepClick && currentStep >= step.number && "cursor-pointer"
                )}
              >
                <motion.span
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "border-2 border-primary bg-background text-primary",
                    !isCompleted && !isCurrent && "border-2 border-muted bg-background text-muted-foreground"
                  )}
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </motion.span>
                <span className="mt-2 text-sm font-medium text-foreground hidden sm:block">
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground hidden md:block">
                  {step.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
