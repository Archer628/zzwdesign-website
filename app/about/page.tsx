"use client"

import { Mail } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { ui } from "@/lib/content"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8">
      {/* About */}
      <section className="pt-16 md:pt-24">
        <h1 className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t(ui.aboutTitle)}
        </h1>
        <p className="mt-6 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-foreground text-balance md:text-3xl">
          {t(ui.aboutIntro)}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
          {t(ui.aboutText)}
        </p>
      </section>

      {/* Skills */}
      <section className="mt-14 border-t border-border pt-10 md:mt-20 md:pt-12">
        <div className="grid gap-4 md:grid-cols-[180px_1fr] md:gap-12">
          <h2 className="text-sm font-medium text-muted-foreground">{t(ui.aboutSkillsTitle)}</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground text-pretty">
            {t(ui.aboutSkills)}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-14 border-t border-border py-14 md:mt-20 md:py-20">
        <div className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-12">
          <h2 className="text-sm font-medium text-muted-foreground">{t(ui.contactTitle)}</h2>
          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed text-foreground text-pretty md:text-2xl">
              {t(ui.contactText)}
            </p>
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
  )
}
