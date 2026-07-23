import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { authenticate } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const payload = authenticate(request)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '未授权，请先登录' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as Blob | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: '没有找到上传的文件' },
        { status: 400 }
      )
    }

    // 获取文件扩展名
    const fileName = (file as File).name || 'upload'
    const ext = path.extname(fileName) || '.png'

    // 生成唯一文件名
    const timestamp = Date.now()
    const newFileName = `${timestamp}${ext}`

    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // 将 Blob 转换为 Buffer 并写入
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, newFileName)
    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/${newFileName}`,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    )
  }
}
