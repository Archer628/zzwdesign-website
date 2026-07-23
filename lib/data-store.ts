import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import type { Project, Experience } from "./content"

type Locale = "zh" | "en"
type LocalizedString = Record<Locale, string>

export interface SiteData {
  experiences: Experience[]
  ui: Record<string, LocalizedString>
}

const PROJECTS_PATH = path.join(process.cwd(), "data", "projects.json")
const SITE_PATH = path.join(process.cwd(), "data", "site.json")

export async function getProjects(): Promise<Project[]> {
  const raw = await readFile(PROJECTS_PATH, "utf-8")
  return JSON.parse(raw) as Project[]
}

export async function getProject(id: string): Promise<Project | undefined> {
  const projects = await getProjects()
  return projects.find((p) => p.id === id)
}

export async function saveProject(project: Project): Promise<void> {
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.id === project.id)
  if (index >= 0) {
    projects[index] = project
  } else {
    projects.push(project)
  }
  await writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2), "utf-8")
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  await writeFile(PROJECTS_PATH, JSON.stringify(filtered, null, 2), "utf-8")
}

export async function getSiteData(): Promise<SiteData> {
  const raw = await readFile(SITE_PATH, "utf-8")
  return JSON.parse(raw) as SiteData
}

export async function saveSiteData(data: SiteData): Promise<void> {
  await writeFile(SITE_PATH, JSON.stringify(data, null, 2), "utf-8")
}
