"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { ProjectGrid } from "@/components/project-grid"
import { projects, ui } from "@/lib/content"

export default function HomePage() {
  const { t } = useLanguage()
  const featured = projects.slice(0, 3)

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8">
      {/* Hero */}
      <section className="flex min-h-[62vh] flex-col justify-center py-20 md:min-h-[70vh] md:py-28">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t(ui.heroEyebrow)}
        </span>
        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {t(ui.heroLine1)}
          <br className="hidden sm:block" />
          <span className="text-muted-foreground">{t(ui.heroLine2)}</span>
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t(ui.heroCtaWork)}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {t(ui.heroCtaAbout)}
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t(ui.featuredTitle)}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground text-pretty">
              {t(ui.featuredDesc)}
            </p>
          </div>
          <Link
            href="/work"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground sm:inline-flex"
          >
            {t(ui.viewAllWork)}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 md:mt-12">
          <ProjectGrid items={featured} />
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            {t(ui.viewAllWork)}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
