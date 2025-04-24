"use client"

import { useCallback, useEffect, useState } from "react"
import { getCurrentLocale, getTranslation, setLocale, i18nConfig } from "@/lib/i18n"

type Locale = "en" | "es" | "fr" | "de"

export function useTranslation(namespace = "common") {
  const [locale, setCurrentLocale] = useState<Locale>(i18nConfig.defaultLocale)

  // Initialize locale on client side
  useEffect(() => {
    setCurrentLocale(getCurrentLocale())
  }, [])

  const t = useCallback(
    (key: string) => {
      return getTranslation(key, locale, namespace)
    },
    [locale, namespace],
  )

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale)
    setCurrentLocale(newLocale)
  }, [])

  return {
    t,
    locale,
    changeLocale,
    supportedLocales: i18nConfig.supportedLocales,
  }
}
