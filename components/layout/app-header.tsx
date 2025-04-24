"use client"

import Link from "next/link"
import { usePathname } from "@/next/navigation"
import { Bell, Menu, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { RoleSelector } from "./role-selector"
import { AppSidebar } from "./app-sidebar"
import { QuickAccess } from "./quick-access"
import { useMobile } from "@/hooks/use-mobile"
import { LanguageSelector } from "@/components/layout/language-selector"

// Update the AppHeader component to include a mobile-friendly navigation menu
export function AppHeader() {
  const pathname = usePathname()
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 sm:max-w-xs">
              <AppSidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <AppSidebar />
        )}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">Desk365</span>
        </Link>
        <div className="flex-1 flex items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
          <QuickAccess />
          <LanguageSelector />
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <RoleSelector />
        </div>
      </div>
    </header>
  )
}
