"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import type { Project } from "@/lib/content"

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { t } = useLanguage()

  return (
    <Link
      href={`/work/${project.id}`}
      className="group flex flex-col rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={t(project.title)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-secondary">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={t(project.title)}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />
        <div className="absolute right-3 top-3 flex size-9 translate-y-1 items-center justify-center rounded-full bg-brand text-brand-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-foreground">
            {t(project.title)}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(project.summary)}</p>
        </div>
        <span className="shrink-0 pt-1 font-mono text-xs tabular-nums text-muted-foreground">{project.year}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="size-1.5 rounded-full" style={{ backgroundColor: project.accent }} aria-hidden="true" />
        <span className="text-xs text-muted-foreground">{t(project.category)}</span>
      </div>
    </Link>
  )
}
