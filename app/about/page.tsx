import { Mail } from "lucide-react"
import { fetchSiteData, getLocale, makeT } from "@/lib/server-data"

export default async function AboutPage() {
  const [siteData, locale] = await Promise.all([fetchSiteData(), getLocale()])
  const t = makeT(locale)
  const { ui, experiences } = siteData

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8">
      {/* About */}
      <section className="pt-16 md:pt-24">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-brand" aria-hidden="true" />
          <span className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {t(ui.aboutTitle)}
          </span>
        </div>
        <p className="mt-8 max-w-3xl font-serif text-3xl font-semibold leading-snug tracking-tight text-foreground text-balance md:text-4xl">
          {t(ui.aboutIntro)}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
          {t(ui.aboutText)}
        </p>
      </section>

      {/* Experience */}
      <section className="mt-16 border-t border-border pt-12 md:mt-24 md:pt-16">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-brand-foreground">01</span>
              <span className="h-px w-8 bg-border" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t(ui.experienceTitle)}
            </h2>
          </div>

          <ol className="relative border-l border-border">
            {experiences.map((exp) => (
              <li key={t(exp.company)} className="relative pb-10 pl-8 last:pb-0">
                <span
                  className="absolute -left-[6.5px] top-1.5 size-3 rounded-full border-2 border-background bg-brand"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t(exp.period)}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  {t(exp.company)}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-brand-foreground">{t(exp.role)}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
                  {t(exp.description)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Skills */}
      <section className="mt-16 border-t border-border pt-12 md:mt-24 md:pt-16">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-brand-foreground">02</span>
              <span className="h-px w-8 bg-border" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t(ui.aboutSkillsTitle)}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground text-pretty">
            {t(ui.aboutSkills)}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-16 border-t border-border py-14 md:mt-24 md:py-20">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-brand-foreground">03</span>
              <span className="h-px w-8 bg-border" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t(ui.contactTitle)}
            </h2>
          </div>
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
