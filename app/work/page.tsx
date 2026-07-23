"use client"

import { useLanguage } from "@/components/language-provider"
import { ProjectGrid } from "@/components/project-grid"
import { ui } from "@/lib/content"

export default function WorkPage() {
  const { t } = useLanguage()

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8">
      <section className="pt-16 md:pt-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl">
            {t(ui.sectionWork)}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            {t(ui.sectionWorkDesc)}
          </p>
        </div>

        <div className="mt-12 pb-20 md:mt-16 md:pb-28">
          <ProjectGrid />
        </div>
      </section>
    </main>
  )
}
