import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { fetchProject, fetchProjects, fetchSiteData, getLocale, makeT } from "@/lib/server-data"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [project, allProjects, siteData, locale] = await Promise.all([
    fetchProject(id),
    fetchProjects(),
    fetchSiteData(),
    getLocale(),
  ])

  if (!project) {
    notFound()
  }

  const t = makeT(locale)
  const { ui } = siteData

  const currentIndex = allProjects.findIndex((p) => p.id === id)
  const next = allProjects[(currentIndex + 1) % allProjects.length]

  const sections = [
    { label: t(ui.challengeLabel), body: t(project.challenge) },
    { label: t(ui.solutionLabel), body: t(project.solution) },
    { label: t(ui.outcomeLabel), body: t(project.outcome) },
  ]

  return (
    <main className="mx-auto max-w-5xl px-5 md:px-8">
      {/* Back */}
      <div className="pt-8 md:pt-12">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t(ui.backToWork)}
        </Link>
      </div>

      {/* Header */}
      <header className="mt-8 md:mt-12">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: project.accent }} aria-hidden="true" />
          <span className="text-xs font-medium text-muted-foreground">{t(project.category)}</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
          {t(project.title)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
          {t(project.summary)}
        </p>
      </header>

      {/* Hero image */}
      <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/60 bg-secondary md:mt-12">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={t(project.title)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="object-cover"
        />
      </div>

      {/* Meta */}
      <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-border py-8 sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">{t(ui.role)}</dt>
          <dd className="mt-1.5 text-sm font-medium text-foreground">{t(project.role)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t(ui.year)}</dt>
          <dd className="mt-1.5 text-sm font-medium tabular-nums text-foreground">{project.year}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t(ui.category)}</dt>
          <dd className="mt-1.5 text-sm font-medium text-foreground">{t(project.category)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Tags</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {tag}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      {/* Overview */}
      <section className="mt-12 grid gap-4 md:grid-cols-[180px_1fr] md:gap-12">
        <h2 className="text-sm font-medium text-muted-foreground">{t(ui.overview)}</h2>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground text-pretty md:text-xl">
          {t(project.description)}
        </p>
      </section>

      {/* Narrative sections */}
      <div className="mt-14 space-y-12 md:mt-16">
        {sections.map((section) => (
          <section key={section.label} className="grid gap-4 border-t border-border pt-10 md:grid-cols-[180px_1fr] md:gap-12">
            <h2 className="text-sm font-medium text-muted-foreground">{section.label}</h2>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/90 text-pretty md:text-lg">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      {/* Next project */}
      <section className="mt-16 border-t border-border py-12 md:mt-24 md:py-16">
        <Link href={`/work/${next.id}`} className="group flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t(ui.nextProject)}</span>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t(next.title)}
            </p>
          </div>
          <span className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-colors group-hover:bg-secondary">
            <ArrowRight className="size-5" />
          </span>
        </Link>
      </section>
    </main>
  )
}
