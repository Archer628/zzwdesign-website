import { NextRequest, NextResponse } from 'next/server'
import { authenticate, readDataFile, writeDataFile } from '@/lib/auth'
import type { Project } from '@/lib/content'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const projects = readDataFile<Project[]>('data/projects.json')
    const project = projects.find((p) => p.id === id)

    if (!project) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, project })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取项目失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticate(request)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '未授权，请先登录' },
        { status: 401 }
      )
    }

    const { id } = await params
    const updateData = (await request.json()) as Partial<Project>

    const projects = readDataFile<Project[]>('data/projects.json')
    const index = projects.findIndex((p) => p.id === id)

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      )
    }

    const updatedProject: Project = {
      ...projects[index],
      ...updateData,
      id: projects[index].id, // 保持 ID 不变
    }

    projects[index] = updatedProject
    writeDataFile('data/projects.json', projects)

    return NextResponse.json({ success: true, project: updatedProject })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新项目失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticate(request)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '未授权，请先登录' },
        { status: 401 }
      )
    }

    const { id } = await params
    const projects = readDataFile<Project[]>('data/projects.json')
    const index = projects.findIndex((p) => p.id === id)

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      )
    }

    projects.splice(index, 1)
    writeDataFile('data/projects.json', projects)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除项目失败' },
      { status: 500 }
    )
  }
}
