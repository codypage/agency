"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "@/next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bookmark, ChevronDown, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define the shortcut type
interface Shortcut {
  id: string
  label: string
  path: string
  icon?: string
}

// Common shortcuts that are always available
const commonShortcuts: Shortcut[] = [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "project-management", label: "Project Management", path: "/project-management" },
  { id: "authorizations", label: "Authorizations", path: "/authorizations" },
  { id: "reports", label: "Reports", path: "/reports" },
]

export function QuickAccess() {
  const { toast } = useToast()
  const pathname = usePathname()
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])

  // Load shortcuts from localStorage on component mount
  useEffect(() => {
    const savedShortcuts = localStorage.getItem("userShortcuts")
    if (savedShortcuts) {
      try {
        setShortcuts(JSON.parse(savedShortcuts))
      } catch (e) {
        console.error("Failed to parse shortcuts", e)
        setShortcuts([])
      }
    }
  }, [])

  // Save shortcuts to localStorage when they change
  useEffect(() => {
    if (shortcuts.length > 0) {
      localStorage.setItem("userShortcuts", JSON.stringify(shortcuts))
    }
  }, [shortcuts])

  // Add current page as a shortcut
  const addCurrentPageAsShortcut = () => {
    if (!pathname) return

    // Don't add if already in shortcuts
    if (shortcuts.some((s) => s.path === pathname)) {
      toast({
        title: "Already in shortcuts",
        description: "This page is already in your shortcuts.",
        variant: "default",
      })
      return
    }

    // Generate a label from the path
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1] || "Home"
    const label = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ")

    const newShortcut: Shortcut = {
      id: `custom-${Date.now()}`,
      label,
      path: pathname,
    }

    setShortcuts([...shortcuts, newShortcut])

    toast({
      title: "Shortcut added",
      description: `"${label}" has been added to your shortcuts.`,
      variant: "default",
    })
  }

  // Remove a shortcut
  const removeShortcut = (id: string) => {
    setShortcuts(shortcuts.filter((s) => s.id !== id))

    toast({
      title: "Shortcut removed",
      description: "The shortcut has been removed from your list.",
      variant: "default",
    })
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Access</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Navigation Shortcuts</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Common shortcuts */}
          {commonShortcuts.map((shortcut) => (
            <DropdownMenuItem key={shortcut.id} asChild>
              <Link href={shortcut.path}>{shortcut.label}</Link>
            </DropdownMenuItem>
          ))}

          {shortcuts.length > 0 && <DropdownMenuSeparator />}

          {/* User's custom shortcuts */}
          {shortcuts.map((shortcut) => (
            <DropdownMenuItem key={shortcut.id} className="flex justify-between items-center">
              <Link href={shortcut.path} className="flex-1">
                {shortcut.label}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeShortcut(shortcut.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={addCurrentPageAsShortcut}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add current page</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
