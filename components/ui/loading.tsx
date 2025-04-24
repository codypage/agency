import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type LoadingVariant = "spinner" | "skeleton" | "dots"

interface LoadingProps {
  variant?: LoadingVariant
  text?: string
  className?: string
  size?: "sm" | "md" | "lg"
  fullPage?: boolean
  count?: number
  height?: number | string
  width?: number | string
}

export function Loading({
  variant = "spinner",
  text = "Loading...",
  className,
  size = "md",
  fullPage = false,
  count = 1,
  height,
  width,
}: LoadingProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const containerClasses = cn(
    "flex flex-col items-center justify-center",
    fullPage && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
    className,
  )

  const renderSkeleton = () => {
    return (
      <div className={cn("w-full space-y-2", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("rounded-md", {
              "h-4": !height && size === "sm",
              "h-8": !height && size === "md",
              "h-12": !height && size === "lg",
              "w-full": !width,
            })}
            style={{
              height: height,
              width: width,
            }}
          />
        ))}
      </div>
    )
  }

  const renderSpinner = () => {
    return (
      <div className={containerClasses}>
        <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} aria-hidden="true" />
        {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        <span className="sr-only">{text || "Loading"}</span>
      </div>
    )
  }

  const renderDots = () => {
    return (
      <div className={containerClasses}>
        <div className="flex space-x-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn("bg-primary rounded-full animate-pulse", {
                "h-1 w-1": size === "sm",
                "h-2 w-2": size === "md",
                "h-3 w-3": size === "lg",
              })}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        <span className="sr-only">{text || "Loading"}</span>
      </div>
    )
  }

  switch (variant) {
    case "skeleton":
      return renderSkeleton()
    case "dots":
      return renderDots()
    case "spinner":
    default:
      return renderSpinner()
  }
}
