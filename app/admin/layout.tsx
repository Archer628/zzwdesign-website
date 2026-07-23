"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FolderKanban, Plus, Settings, LogOut, User } from "lucide-react"
import { AdminAuthProvider, useAdminAuth } from "@/components/admin-auth-context"
import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

function AdminSidebar() {
  const pathname = usePathname()
  const { logout, isAuthenticated } = useAdminAuth()
  const router = useRouter()

  const navItems = [
    { key: "dashboard", label: "仪表盘", href: "/admin", icon: LayoutDashboard },
    { key: "projects", label: "项目管理", href: "/admin", icon: FolderKanban },
    { key: "new-project", label: "新建项目", href: "/admin/projects/new", icon: Plus },
    { key: "settings", label: "站点设置", href: "/admin/settings", icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border/60 bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
          <User className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">后台管理</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-brand/15 text-brand-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-border/60 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          退出登录
        </button>
      </div>
    </aside>
  )
}

function AdminHeader() {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
      <div>
        <h1 className="text-base font-semibold text-foreground">项目管理</h1>
        <p className="text-xs text-muted-foreground">管理作品集的所有项目内容</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          已登录
        </span>
      </div>
    </header>
  )
}

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="pl-60">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  )
}
