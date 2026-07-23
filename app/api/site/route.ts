import { NextRequest, NextResponse } from 'next/server'
import { authenticate, readDataFile, writeDataFile } from '@/lib/auth'
import type { Experience } from '@/lib/content'

export const dynamic = 'force-dynamic'

type LocalizedString = Record<'zh' | 'en', string>

interface SiteData {
  experiences: Experience[]
  ui: Record<string, LocalizedString>
}

export async function GET() {
  try {
    const siteData = readDataFile<SiteData>('data/site.json')
    return NextResponse.json({ success: true, ...siteData })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取站点数据失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = authenticate(request)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '未授权，请先登录' },
        { status: 401 }
      )
    }

    const updateData = (await request.json()) as Partial<SiteData>

    const currentData = readDataFile<SiteData>('data/site.json')

    const newData: SiteData = {
      experiences: updateData.experiences ?? currentData.experiences,
      ui: updateData.ui ?? currentData.ui,
    }

    writeDataFile('data/site.json', newData)

    return NextResponse.json({ success: true, ...newData })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新站点数据失败' },
      { status: 500 }
    )
  }
}
