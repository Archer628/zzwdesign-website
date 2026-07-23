"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"
import { useAdminAuth } from "@/components/admin-auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 已登录则跳转到后台首页
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("请输入用户名和密码")
      return
    }

    setLoading(true)
    const result = await login(username.trim(), password)

    if (result.success) {
      router.push("/admin")
    } else {
      setError(result.error || "登录失败")
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* 装饰性背景 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 hidden size-[420px] rounded-full bg-brand/20 blur-3xl md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 hidden size-[380px] rounded-full bg-brand/10 blur-3xl md:block"
      />

      <div className="relative w-full max-w-md">
        {/* 返回链接 */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            返回首页
          </Link>
        </div>

        {/* 登录卡片 */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          {/* Logo / 标题 */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <Lock className="size-5" />
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              后台登录
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              请输入管理员账号以访问后台
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                用户名
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  autoComplete="username"
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                密码
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
        </div>

        {/* 底部提示 */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          受保护的管理区域 · 仅限授权人员访问
        </p>
      </div>
    </div>
  )
}
