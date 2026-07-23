"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { ui, type Project } from "@/lib/content"

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { t } = useLanguage()

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-foreground/40 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t(project.title)}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl border border-border bg-card shadow-xl animate-in slide-in-from-bottom-4 duration-300 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t(ui.close)}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
        >
          <X className="size-4" />
        </button>

        <div className="relative aspect-[16/10] w-full bg-secondary">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={t(project.title)}
            fill
            sizes="(max-width: 768px) 100vw, 42rem"
            className="object-cover"
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: project.accent }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-muted-foreground">{t(project.category)}</span>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground text-balance">
            {t(project.title)}
          </h2>
          <p className="mt-1.5 text-base text-muted-foreground">{t(project.summary)}</p>

          <p className="mt-5 text-sm leading-relaxed text-foreground/80 text-pretty">{t(project.description)}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">{t(ui.role)}</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{t(project.role)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t(ui.year)}</dt>
              <dd className="mt-1 text-sm font-medium tabular-nums text-foreground">{project.year}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t(ui.category)}</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{t(project.category)}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
