"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/use-translation"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { locale, changeLocale, supportedLocales } = useTranslation()

  const localeNames: Record<string, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLocales.map((supportedLocale) => (
          <DropdownMenuItem
            key={supportedLocale}
            onClick={() => changeLocale(supportedLocale)}
            className={locale === supportedLocale ? "bg-accent font-medium" : ""}
          >
            {localeNames[supportedLocale] || supportedLocale}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
