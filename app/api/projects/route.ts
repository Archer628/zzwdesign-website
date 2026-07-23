import { NextRequest, NextResponse } from 'next/server'
import { authenticate, readDataFile, writeDataFile } from '@/lib/auth'
import type { Project } from '@/lib/content'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const projects = readDataFile<Project[]>('data/projects.json')
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取项目列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = authenticate(request)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '未授权，请先登录' },
        { status: 401 }
      )
    }

    const projectData = (await request.json()) as Partial<Project>

    if (!projectData.id || !projectData.title) {
      return NextResponse.json(
        { success: false, error: '项目 ID 和标题不能为空' },
        { status: 400 }
      )
    }

    const projects = readDataFile<Project[]>('data/projects.json')

    // 检查 ID 是否重复
    if (projects.some((p) => p.id === projectData.id)) {
      return NextResponse.json(
        { success: false, error: '项目 ID 已存在' },
        { status: 400 }
      )
    }

    const newProject: Project = {
      id: projectData.id,
      image: projectData.image || '',
      gallery: projectData.gallery || [],
      year: projectData.year || new Date().getFullYear().toString(),
      accent: projectData.accent || 'oklch(0.6 0.12 250)',
      title: projectData.title || { zh: '', en: '' },
      summary: projectData.summary || { zh: '', en: '' },
      category: projectData.category || { zh: '', en: '' },
      role: projectData.role || { zh: '', en: '' },
      description: projectData.description || { zh: '', en: '' },
      challenge: projectData.challenge || { zh: '', en: '' },
      solution: projectData.solution || { zh: '', en: '' },
      outcome: projectData.outcome || { zh: '', en: '' },
      tags: projectData.tags || [],
    }

    projects.push(newProject)
    writeDataFile('data/projects.json', projects)

    return NextResponse.json({ success: true, project: newProject })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '创建项目失败' },
      { status: 500 }
    )
  }
}
