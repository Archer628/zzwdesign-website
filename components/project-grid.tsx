"use client"

import { ProjectCard } from "@/components/project-card"
import type { Project } from "@/lib/content"

export function ProjectGrid({ items }: { items: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((project, i) => (
        <ProjectCard key={project.id} project={project} priority={i < 3} />
      ))}
    </div>
  )
}
