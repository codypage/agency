import * as React from "react"

import { cn } from "@/lib/utils"

const Steps = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentStep: number
    orientation?: "horizontal" | "vertical"
    size?: "sm" | "md" | "lg"
  }
>(({ className, currentStep, orientation = "horizontal", size = "md", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(orientation === "horizontal" ? "flex justify-between" : "flex flex-col gap-8", className)}
      {...props}
    >
      {React.Children.map(props.children, (child, index) => {
        return React.cloneElement(child as React.ReactElement, {
          step: index + 1,
          isCompleted: index + 1 < currentStep,
          isActive: index + 1 === currentStep,
          orientation,
          size,
        })
      })}
    </div>
  )
})
Steps.displayName = "Steps"

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    step: number
    isCompleted?: boolean
    isActive?: boolean
    orientation?: "horizontal" | "vertical"
    size?: "sm" | "md" | "lg"
  }
>(({ className, step, isCompleted, isActive, orientation = "horizontal", size = "md", children, ...props }, ref) => {
  // Size mappings
  const sizeMap = {
    sm: { circle: "w-3 h-3", icon: "h-2 w-2", offset: "-top-1.5 -ml-1.5" },
    md: { circle: "w-4 h-4", icon: "h-3 w-3", offset: "-top-2 -ml-2" },
    lg: { circle: "w-5 h-5", icon: "h-4 w-4", offset: "-top-2.5 -ml-2.5" },
  }

  const { circle, icon, offset } = sizeMap[size]

  return (
    <div ref={ref} className={cn("relative", orientation === "vertical" && "pl-8", className)} {...props}>
      {children}
      {isCompleted ? (
        <span
          className={cn(
            `absolute ${offset} ${circle} rounded-full bg-green-500 border-2 border-background`,
            orientation === "vertical" && "left-0 top-0",
          )}
        >
          <Check className={icon} />
        </span>
      ) : (
        <span
          className={cn(
            `absolute ${offset} ${circle} rounded-full border-2 border-muted bg-background`,
            isActive && "border-primary",
            orientation === "vertical" && "left-0 top-0",
          )}
        />
      )}

      {/* Add connecting line for vertical orientation */}
      {orientation === "vertical" && step !== 1 && <span className="absolute left-[7px] -top-8 w-[2px] h-8 bg-muted" />}
    </div>
  )
})
Step.displayName = "Step"

const StepHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("text-center", className)} {...props} />
  },
)
StepHeader.displayName = "StepHeader"

const StepTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
  },
)
StepTitle.displayName = "StepTitle"

const StepDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  },
)
StepDescription.displayName = "StepDescription"

import { Check } from "lucide-react"

export { Steps, Step, StepHeader, StepTitle, StepDescription }
