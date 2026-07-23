import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProjectGrid } from "@/components/project-grid"
import { fetchProjects, fetchSiteData, getLocale, makeT } from "@/lib/server-data"

export default async function HomePage() {
  const [projects, siteData, locale] = await Promise.all([
    fetchProjects(),
    fetchSiteData(),
    getLocale(),
  ])
  const t = makeT(locale)
  const { ui } = siteData
  const featured = projects.slice(0, 3)

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* decorative brand blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 hidden size-[380px] rounded-full bg-brand/25 blur-3xl md:block"
        />
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex min-h-[78vh] flex-col justify-center py-20 md:py-28">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand" aria-hidden="true" />
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                {t(ui.heroEyebrow)}
              </span>
            </div>

            <h1 className="mt-8 max-w-5xl text-balance font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t(ui.heroLine1)}
              <br />
              <span className="relative inline-block">
                {t(ui.heroLine2)}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 -z-0 h-3 w-full bg-brand/40 md:-bottom-2 md:h-4"
                />
              </span>
            </h1>

            <p className="mt-10 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {t(ui.heroSub)}
            </p>

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
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="flex items-end justify-between gap-4 border-t border-border pt-14 md:pt-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-brand-foreground">01</span>
              <span className="h-px w-8 bg-border" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t(ui.featuredTitle)}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
              {t(ui.featuredDesc)}
            </p>
          </div>
          <Link
            href="/work"
            className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand-foreground sm:inline-flex"
          >
            {t(ui.viewAllWork)}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 md:mt-12">
          <ProjectGrid items={featured} />
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand-foreground"
          >
            {t(ui.viewAllWork)}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
