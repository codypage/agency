"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-50 text-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
  duration?: number
  onClose: (id: string) => void
  undoAction?: () => void
  undoText?: string
}

export function ToastNotification({
  id,
  title,
  description,
  action,
  variant = "default",
  duration = 5000,
  onClose,
  undoAction,
  undoText = "Undo",
}: ToastProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 100)
      } else {
        onClose(id)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [timeLeft, isPaused, id, onClose])

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  const progressPercentage = (timeLeft / duration) * 100

  return (
    <div
      className={cn(toastVariants({ variant }), "relative")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <div className="flex items-center gap-2">
        {undoAction && (
          <button
            onClick={() => {
              undoAction()
              onClose(id)
            }}
            className="text-sm font-medium underline underline-offset-4"
          >
            {undoText}
          </button>
        )}
        {action}
        <button
          onClick={() => onClose(id)}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary/20" style={{ width: "100%" }}>
        <div
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
