"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Languages } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { ui } from "@/lib/content"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { locale, toggleLocale, t } = useLanguage()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const navItems = [
    { key: "home", label: t(ui.navHome), href: "/" },
    { key: "work", label: t(ui.navWork), href: "/work" },
    { key: "about", label: t(ui.navAbout), href: "/about" },
  ]

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-5 py-4 md:gap-4 md:px-8">
        <Link href="/" className="flex shrink-0 flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight text-foreground">{t(ui.brandName)}</span>
          <span className="hidden text-xs text-muted-foreground sm:block">{t(ui.brandRole)}</span>
        </Link>

        <nav className="flex items-center gap-0.5 md:gap-1" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-secondary hover:text-foreground md:px-3",
                isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
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
