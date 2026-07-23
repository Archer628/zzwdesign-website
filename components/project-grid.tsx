"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { ProjectDialog } from "@/components/project-dialog"
import { projects, type Project } from "@/lib/content"

export function ProjectGrid() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={() => setActive(project)} />
        ))}
      </div>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </>
  )
}
