import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateToken, readDataFile } from '@/lib/auth'

interface AdminCredentials {
  username: string
  passwordHash: string
}

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username: string
      password: string
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    const admin = readDataFile<AdminCredentials>('data/admin.json')

    if (username !== admin.username) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const token = generateToken(username)

    return NextResponse.json({ success: true, token })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
