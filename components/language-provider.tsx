"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { Locale } from "@/lib/content"

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (entry: Record<Locale, string>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "portfolio-locale"
const COOKIE_KEY = "portfolio-locale"

function setLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return
  document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored === "zh" || stored === "en") {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    setLocaleCookie(next)
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en"
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === "zh" ? "en" : "zh")
  }, [locale, setLocale])

  const t = useCallback((entry: Record<Locale, string>) => entry[locale], [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return ctx
}
