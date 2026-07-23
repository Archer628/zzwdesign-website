"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useAdminAuth, authHeaders } from "@/lib/use-admin-auth"
import type { Experience } from "@/lib/content"
import { Button } from "@/components/ui/button"

type Locale = "zh" | "en"
type LocalizedString = Record<Locale, string>

const PERSONAL_FIELDS = [
  { key: "brandName", label: "品牌名", type: "text" },
  { key: "brandRole", label: "角色", type: "text" },
  { key: "aboutIntro", label: "关于我 - 介绍", type: "text" },
  { key: "aboutText", label: "关于我 - 正文", type: "textarea" },
  { key: "aboutSkills", label: "专长", type: "text" },
  { key: "contactTitle", label: "联系 - 标题", type: "text" },
  { key: "contactText", label: "联系 - 描述", type: "textarea" },
] as const

const emptyLocalized = (): LocalizedString => ({ zh: "", en: "" })

const emptyExperience = (): Experience => ({
  period: emptyLocalized(),
  company: emptyLocalized(),
  role: emptyLocalized(),
  description: emptyLocalized(),
})

export default function SettingsPage() {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated } = useAdminAuth()

  const [isFetching, setIsFetching] = useState(true)
  const [ui, setUi] = useState<Record<string, LocalizedString>>({})
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 加载站点数据
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await fetch("/api/site", {
          headers: authHeaders(),
        })
        const data = await res.json()
        if (data.success) {
          setUi(data.ui || {})
          setExperiences(data.experiences || [])
        } else {
          setError(data.error || "加载站点数据失败")
        }
      } catch {
        setError("加载站点数据失败")
      } finally {
        setIsFetching(false)
      }
    }
    fetchSiteData()
  }, [])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (isFetching) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
        <p className="text-muted-foreground">加载站点数据...</p>
      </div>
    )
  }

  const updateUi = (key: string, locale: Locale, value: string) => {
    setUi((prev) => ({
      ...prev,
      [key]: {
        zh: prev[key]?.zh || "",
        en: prev[key]?.en || "",
        [locale]: value,
      },
    }))
  }

  const updateExperience = (
    index: number,
    field: keyof Experience,
    locale: Locale,
    value: string
  ) => {
    setExperiences((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [field]: {
          ...next[index][field],
          [locale]: value,
        },
      }
      return next
    })
  }

  const addExperience = () => {
    setExperiences((prev) => [...prev, emptyExperience()])
  }

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          ui,
          experiences,
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push("/admin")
      } else {
        setError(data.error || "保存失败")
      }
    } catch {
      setError("保存失败")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        返回管理后台
      </Link>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            站点设置
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            编辑个人信息与工作经历，支持中英双语
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* 个人信息 */}
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-serif text-xl font-semibold">个人信息</h2>
          <div className="space-y-6">
            {PERSONAL_FIELDS.map((field) => (
              <div key={field.key} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {field.label}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">中文</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={ui[field.key]?.zh || ""}
                        onChange={(e) => updateUi(field.key, "zh", e.target.value)}
                        rows={4}
                        className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    ) : (
                      <input
                        type="text"
                        value={ui[field.key]?.zh || ""}
                        onChange={(e) => updateUi(field.key, "zh", e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">English</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={ui[field.key]?.en || ""}
                        onChange={(e) => updateUi(field.key, "en", e.target.value)}
                        rows={4}
                        className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    ) : (
                      <input
                        type="text"
                        value={ui[field.key]?.en || ""}
                        onChange={(e) => updateUi(field.key, "en", e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 工作经历 */}
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">工作经历</h2>
            <Button type="button" variant="outline" size="sm" onClick={addExperience}>
              <Plus className="size-4" />
              添加经历
            </Button>
          </div>

          {experiences.length === 0 && (
            <p className="text-sm text-muted-foreground">暂无工作经历，点击上方按钮添加</p>
          )}

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="space-y-4 rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    经历 {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-4" />
                    删除
                  </Button>
                </div>

                {/* Period */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">时间段 (中文)</label>
                    <input
                      type="text"
                      value={exp.period.zh}
                      onChange={(e) => updateExperience(index, "period", "zh", e.target.value)}
                      placeholder="2021 — 至今"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Period (EN)</label>
                    <input
                      type="text"
                      value={exp.period.en}
                      onChange={(e) => updateExperience(index, "period", "en", e.target.value)}
                      placeholder="2021 — Present"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">公司 (中文)</label>
                    <input
                      type="text"
                      value={exp.company.zh}
                      onChange={(e) => updateExperience(index, "company", "zh", e.target.value)}
                      placeholder="自由设计顾问"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Company (EN)</label>
                    <input
                      type="text"
                      value={exp.company.en}
                      onChange={(e) => updateExperience(index, "company", "en", e.target.value)}
                      placeholder="Independent Design Consultant"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">职位 (中文)</label>
                    <input
                      type="text"
                      value={exp.role.zh}
                      onChange={(e) => updateExperience(index, "role", "zh", e.target.value)}
                      placeholder="数字产品设计师"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Role (EN)</label>
                    <input
                      type="text"
                      value={exp.role.en}
                      onChange={(e) => updateExperience(index, "role", "en", e.target.value)}
                      placeholder="Digital Product Designer"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">描述 (中文)</label>
                    <textarea
                      value={exp.description.zh}
                      onChange={(e) => updateExperience(index, "description", "zh", e.target.value)}
                      rows={3}
                      className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Description (EN)</label>
                    <textarea
                      value={exp.description.en}
                      onChange={(e) => updateExperience(index, "description", "en", e.target.value)}
                      rows={3}
                      className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存设置"}
          </Button>
        </div>
      </form>
    </div>
  )
}
