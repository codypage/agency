import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppHeader } from "@/components/layout/app-header"
import { Toaster } from "@/components/ui/toaster"
import { NotificationProvider } from "@/components/ui/notification-provider"
import { NotificationService } from "@/lib/notification-service"
import { TaskServiceFacade, SimpleFeatureFlags } from "@/lib/desk365-facade"
import { EmailService } from "@/lib/email-service"
import { RoleProvider } from "@/contexts/role-context"
import { AppSidebar } from "@/components/layout/app-sidebar"

// Import the ErrorBoundary component
import { ErrorBoundary } from "@/components/ui/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Healthcare Project Management",
  description: "Project management system for healthcare organizations",
    generator: 'v0.dev'
}

// Initialize services
// In a real app, these would be initialized with actual API clients
const featureFlags = new SimpleFeatureFlags({
  tasks: true,
  comments: true,
  attachments: true,
  notifications: true,
  admin: true,
})

const taskService = new TaskServiceFacade(null, featureFlags)

// Initialize email service
const emailService = new EmailService({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "notifications@example.com",
    pass: "password123",
  },
  from: "Healthcare PM <notifications@example.com>",
})

// Initialize notification service with email service
const notificationService = new NotificationService(taskService, featureFlags, emailService)

// Wrap the main content with the ErrorBoundary
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <RoleProvider>
            <NotificationProvider notificationService={notificationService} emailService={emailService}>
              <div className="relative min-h-screen flex">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <AppHeader />
                  <ErrorBoundary>
                    <main className="flex-1">{children}</main>
                  </ErrorBoundary>
                </div>
              </div>
              <Toaster />
            </NotificationProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
