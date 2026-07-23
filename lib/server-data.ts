import { getProjects, getProject, getSiteData } from "@/lib/data-store"
import {
  projects,
  experiences,
  ui,
  type Project,
  type Experience,
  type Locale,
  type UiStrings,
} from "@/lib/content"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SiteDataResult {
  experiences: Experience[]
  ui: UiStrings
}

// ---------------------------------------------------------------------------
// Async data loaders (read from the JSON data-store via `lib/data-store`)
// These are safe to import from Server Components.
// ---------------------------------------------------------------------------

/**
 * Fetch all projects from the data-store (data/projects.json).
 * Falls back to the static `projects` array if the read fails.
 */
export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await getProjects()
    if (Array.isArray(data) && data.length > 0) return data
  } catch {
    /* fall through to static fallback */
  }
  return projects
}

/**
 * Fetch a single project by id from the data-store.
 * Falls back to the static `projects` array if the read fails.
 */
export async function fetchProject(id: string): Promise<Project | undefined> {
  try {
    const data = await getProject(id)
    if (data) return data
  } catch {
    /* fall through to static fallback */
  }
  return projects.find((p) => p.id === id)
}

/**
 * Fetch site-wide data (experiences + ui strings) from the data-store
 * (data/site.json).  Falls back to the static `experiences` and `ui`
 * exports if the read fails.
 */
export async function fetchSiteData(): Promise<SiteDataResult> {
  try {
    const data = await getSiteData()
    if (data && Array.isArray(data.experiences) && data.ui) {
      return {
        experiences: data.experiences,
        ui: (data.ui as UiStrings) ?? ui,
      }
    }
  } catch {
    /* fall through to static fallback */
  }
  return { experiences, ui }
}

// ---------------------------------------------------------------------------
// Server-side locale helpers (reads from cookies set by LanguageProvider)
// ---------------------------------------------------------------------------

const LOCALE_COOKIE = "portfolio-locale"

/**
 * Read the user's locale preference on the server side (from cookies).
 * Falls back to `"zh"` if no cookie is found.
 *
 * Note: This uses `next/headers` which marks the route as dynamic.
 * Only call this from Server Components / Route Handlers.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const stored = cookieStore.get(LOCALE_COOKIE)?.value
    if (stored === "zh" || stored === "en") return stored
  } catch {
    /* fall through to default */
  }
  return "zh"
}

/**
 * Build a `t()` function for the given locale.  Useful in Server
 * Components where `useLanguage()` is not available.
 */
export function makeT(locale: Locale) {
  return <T extends Record<Locale, string>>(entry: T): string => entry[locale]
}
