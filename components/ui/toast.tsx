"use client"

// This is a placeholder for the toast component that would be used in the CreateTaskDialog
// In a real implementation, this would be a proper toast component

import type React from "react"

export function useToast() {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      console.log(`Toast: ${title} - ${description} (${variant || "default"})`)
    },
  }
}

export const Toast = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-white border rounded-md shadow-lg p-4">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
