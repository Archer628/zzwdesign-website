"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { ui } from "@/lib/content"

export function SiteFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:px-8">
        <span>
          © {year} {t(ui.brandName)}. {t(ui.footer)}.
        </span>
        <nav className="flex items-center gap-4" aria-label="Footer">
          <Link href="/" className="transition-colors hover:text-foreground">
            {t(ui.navHome)}
          </Link>
          <Link href="/work" className="transition-colors hover:text-foreground">
            {t(ui.navWork)}
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            {t(ui.navAbout)}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
