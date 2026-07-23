import { readFile } from "node:fs/promises"
import fs from "node:fs"
import path from "node:path"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

const ADMIN_PATH = path.join(process.cwd(), "data", "admin.json")
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-in-production"

/**
 * 同步读取 JSON 数据文件（供服务端 API 使用）
 */
export function readDataFile<T>(relativePath: string): T {
  const fullPath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(fullPath, "utf-8")
  return JSON.parse(raw) as T
}

/**
 * 同步写入 JSON 数据文件（供服务端 API 使用）
 */
export function writeDataFile<T>(relativePath: string, data: T): void {
  const fullPath = path.join(process.cwd(), relativePath)
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8")
}

/**
 * 从请求中验证 JWT Token，返回 payload 或 null
 */
export function authenticate(request: NextRequest): any | null {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }
    const token = authHeader.slice(7)
    return verifyToken(token)
  } catch {
    return null
  }
}

/**
 * 生成 JWT Token（兼容现有调用，接收用户名作为 payload）
 */
export function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" })
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hashSync(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compareSync(password, hash)
}

export function createToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET)
}

export async function getAdminCredentials(): Promise<{ username: string; passwordHash: string }> {
  const raw = await readFile(ADMIN_PATH, "utf-8")
  return JSON.parse(raw) as { username: string; passwordHash: string }
}
