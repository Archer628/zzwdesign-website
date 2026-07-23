"use client"

import { SiteHeader } from "@/components/site-header"
import { ProjectGrid } from "@/components/project-grid"
import { useLanguage } from "@/components/language-provider"
import { ui } from "@/lib/content"
import { Mail } from "lucide-react"

export default function Page() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <div id="top" className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Work */}
        <section id="work" className="pt-16 md:pt-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl">
              {t(ui.sectionWork)}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
              {t(ui.sectionWorkDesc)}
            </p>
          </div>

          <div className="mt-12 md:mt-16">
            <ProjectGrid />
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-border py-16 md:py-24 mt-20 md:mt-28">
          <div className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-12">
            <h2 className="text-sm font-medium text-muted-foreground">{t(ui.aboutTitle)}</h2>
            <p className="max-w-2xl text-xl leading-relaxed text-foreground text-pretty md:text-2xl">
              {t(ui.aboutText)}
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-border py-16 md:py-24">
          <div className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-12">
            <h2 className="text-sm font-medium text-muted-foreground">{t(ui.navContact)}</h2>
            <div className="max-w-2xl">
              <p className="text-xl leading-relaxed text-foreground text-pretty md:text-2xl">
                {t(ui.contactTitle)}
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t(ui.contactText)}</p>
              <a
                href="mailto:hello@chenmo.design"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Mail className="size-4" />
                hello@chenmo.design
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-5 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:px-8">
          <span>
            © {year} {t(ui.brandName)}. {t(ui.footer)}.
          </span>
          <span>Designed & Built with v0</span>
        </div>
      </footer>
    </div>
  )
}
