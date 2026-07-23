"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import type { Project } from "@/lib/content"

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { t } = useLanguage()

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col text-left focus:outline-none"
      aria-label={t(project.title)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-secondary">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={t(project.title)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />
        <div className="absolute right-3 top-3 flex size-9 translate-y-1 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">{t(project.title)}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(project.summary)}</p>
        </div>
        <span className="shrink-0 pt-1 text-xs tabular-nums text-muted-foreground">{project.year}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
          {t(project.category)}
        </span>
      </div>
    </button>
  )
}
