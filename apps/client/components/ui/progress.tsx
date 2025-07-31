'use client';

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Loading spinner component
export function LoadingSpinner({ size = "default", className }: { 
  size?: "sm" | "default" | "lg"; 
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Progress bar with label
export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true,
  className 
}: { 
  value: number; 
  max?: number; 
  label?: string;
  showPercentage?: boolean;
  className?: string;
}) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <Progress value={percentage} />
    </div>
  );
}

// Step progress indicator
export function StepProgress({ 
  steps, 
  currentStep, 
  className 
}: { 
  steps: string[]; 
  currentStep: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                index < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-primary bg-background text-primary"
                  : "border-muted bg-background text-muted-foreground"
              )}
              aria-current={index === currentStep ? "step" : undefined}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-16",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <span className="text-sm font-medium text-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
}

// File upload progress
export function FileUploadProgress({ 
  fileName, 
  progress, 
  status = "uploading",
  onCancel 
}: { 
  fileName: string; 
  progress: number; 
  status?: "uploading" | "success" | "error";
  onCancel?: () => void;
}) {
  const statusConfig = {
    uploading: { color: "text-blue-500", icon: "⏳" },
    success: { color: "text-green-500", icon: "✓" },
    error: { color: "text-red-500", icon: "✗" }
  };

  const config = statusConfig[status];

  return (
    <div className="space-y-2 p-3 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={config.color}>{config.icon}</span>
          <span className="text-sm font-medium truncate">{fileName}</span>
        </div>
        {status === "uploading" && onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground"
            aria-label="Cancel upload"
          >
            Cancel
          </button>
        )}
      </div>
      <Progress value={progress} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{progress}% complete</span>
        <span>{status}</span>
      </div>
    </div>
  );
}

export { Progress } 