"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useAdminAuth } from "@/components/admin-auth-context"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/content"

export default function AdminDashboardPage() {
  const { isAuthenticated, token } = useAdminAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 未登录跳转到登录页
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  // 加载项目列表
  useEffect(() => {
    if (!isAuthenticated || !token) return

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (data.success) {
          setProjects(data.projects || [])
        }
      } catch {
        console.error("获取项目列表失败")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [isAuthenticated, token])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定要删除项目「${title}」吗？此操作不可恢复。`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert(data.error || "删除失败")
      }
    } catch {
      alert("网络错误，删除失败")
    } finally {
      setDeletingId(null)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* 顶部操作栏 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            全部项目
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {projects.length} 个项目
          </p>
        </div>
        <Button onClick={() => router.push("/admin/projects/new")}>
          <Plus className="size-4" />
          新建项目
        </Button>
      </div>

      {/* 项目列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
          <p className="text-sm text-muted-foreground">暂无项目</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/projects/new")}>
            <Plus className="size-4" />
            创建第一个项目
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors hover:border-border"
            >
              {/* 封面图 */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title.zh}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* 内容 */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-lg font-semibold tracking-tight text-foreground">
                      {project.title.zh}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {project.summary.zh}
                    </p>
                  </div>
                  <span className="shrink-0 pt-1 font-mono text-xs tabular-nums text-muted-foreground">
                    {project.year}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: project.accent }}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground">
                    {project.category.zh}
                  </span>
                </div>

                {/* 操作按钮 */}
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/admin/projects/${project.id}`)}
                  >
                    <Pencil className="size-3.5" />
                    编辑
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id, project.title.zh)}
                    disabled={deletingId === project.id}
                  >
                    <Trash2 className="size-3.5" />
                    {deletingId === project.id ? "删除中" : "删除"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
