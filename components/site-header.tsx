"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Languages } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { ui } from "@/lib/content"

export function SiteHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { locale, toggleLocale, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const navItems = [
    { key: "work", label: t(ui.navWork), href: "#work" },
    { key: "about", label: t(ui.navAbout), href: "#about" },
    { key: "contact", label: t(ui.navContact), href: "#contact" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#top" className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight text-foreground">{t(ui.brandName)}</span>
          <span className="text-xs text-muted-foreground">{t(ui.brandRole)}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t(ui.langToggle)}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Languages className="size-3.5" />
            <span className="tabular-nums">{locale === "zh" ? "中" : "EN"}</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark")}
            aria-label={t(ui.themeToggle)}
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {mounted ? (
              (resolvedTheme ?? theme) === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )
            ) : (
              <span className="size-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
