"use client"

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Plus, X } from "lucide-react"
import { useAdminAuth, authHeaders } from "@/lib/use-admin-auth"
import type { Project } from "@/lib/content"
import { Button } from "@/components/ui/button"

type Locale = "zh" | "en"
type LocalizedString = Record<Locale, string>

const BILINGUAL_FIELDS = [
  { key: "title", label: "标题", type: "text" },
  { key: "summary", label: "摘要", type: "textarea" },
  { key: "category", label: "分类", type: "text" },
  { key: "role", label: "角色", type: "text" },
  { key: "description", label: "描述", type: "textarea" },
  { key: "challenge", label: "挑战", type: "textarea" },
  { key: "solution", label: "方案", type: "textarea" },
  { key: "outcome", label: "成果", type: "textarea" },
] as const

const emptyLocalized = (): LocalizedString => ({ zh: "", en: "" })

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { isLoading: authLoading, isAuthenticated } = useAdminAuth()

  const [isFetching, setIsFetching] = useState(true)
  const [id, setId] = useState("")
  const [year, setYear] = useState("")
  const [accent, setAccent] = useState("")
  const [image, setImage] = useState("")
  const [gallery, setGallery] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState("")
  const [bilingual, setBilingual] = useState<Record<string, LocalizedString>>(
    Object.fromEntries(BILINGUAL_FIELDS.map((f) => [f.key, emptyLocalized()]))
  )
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  // 加载项目数据
  useEffect(() => {
    if (!params.id) return
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`, {
          headers: authHeaders(),
        })
        const data = await res.json()
        if (data.success && data.project) {
          const p: Project = data.project
          setId(p.id)
          setYear(p.year)
          setAccent(p.accent)
          setImage(p.image)
          setGallery(p.gallery.length > 0 ? p.gallery : [""])
          setTagsInput(p.tags.join(", "))
          const newBilingual: Record<string, LocalizedString> = {}
          for (const field of BILINGUAL_FIELDS) {
            newBilingual[field.key] = p[field.key as keyof Project] as LocalizedString || emptyLocalized()
          }
          setBilingual(newBilingual)
        } else {
          setError(data.error || "加载项目失败")
        }
      } catch {
        setError("加载项目失败")
      } finally {
        setIsFetching(false)
      }
    }
    fetchProject()
  }, [params.id])

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
        <p className="text-muted-foreground">加载项目数据...</p>
      </div>
    )
  }

  const handleUpload = async (
    file: File,
    onSuccess: (url: string) => void
  ) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        onSuccess(data.url)
      } else {
        setError(data.error || "上传失败")
      }
    } catch {
      setError("上传失败")
    }
  }

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingField("image")
    handleUpload(file, (url) => {
      setImage(url)
      setUploadingField(null)
    })
  }

  const handleGalleryFileChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingField(`gallery-${index}`)
    handleUpload(file, (url) => {
      setGallery((prev) => {
        const next = [...prev]
        next[index] = url
        return next
      })
      setUploadingField(null)
    })
  }

  const addGalleryItem = () => {
    setGallery((prev) => [...prev, ""])
  }

  const removeGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  const updateBilingual = (key: string, locale: Locale, value: string) => {
    setBilingual((prev) => ({
      ...prev,
      [key]: { ...prev[key], [locale]: value },
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const project: Partial<Project> = {
        year,
        accent,
        image,
        gallery: gallery.filter(Boolean),
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        title: bilingual.title,
        summary: bilingual.summary,
        category: bilingual.category,
        role: bilingual.role,
        description: bilingual.description,
        challenge: bilingual.challenge,
        solution: bilingual.solution,
        outcome: bilingual.outcome,
      }

      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(project),
      })

      const data = await res.json()
      if (data.success) {
        router.push("/admin")
      } else {
        setError(data.error || "更新失败")
      }
    } catch {
      setError("更新失败")
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
            编辑项目
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            修改项目信息，支持中英双语内容
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* 基础信息 */}
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-serif text-xl font-semibold">基础信息</h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                ID <span className="text-muted-foreground">(英文标识，不可修改)</span>
              </label>
              <input
                type="text"
                value={id}
                disabled
                className="h-9 w-full cursor-not-allowed rounded-lg border border-input bg-muted px-3 text-sm text-muted-foreground"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">年份</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                主题色 <span className="text-muted-foreground">(oklch)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  placeholder="oklch(0.6 0.12 250)"
                  className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm font-mono outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                <input
                  type="color"
                  value={accent.startsWith("oklch") ? "#6b8aff" : accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-input bg-background"
                />
              </div>
              <div
                className="mt-2 h-6 w-full rounded-md border border-border"
                style={{ background: accent }}
                aria-hidden
              />
            </div>
          </div>
        </section>

        {/* 封面图 */}
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-serif text-xl font-semibold">封面图</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium">封面图 URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/projects/cover.png"
                className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingField === "image"}
              >
                <Upload className="size-4" />
                {uploadingField === "image" ? "上传中..." : "上传"}
              </Button>
            </div>
            {image && (
              <div className="mt-3">
                <img
                  src={image}
                  alt="封面预览"
                  className="h-40 w-full rounded-lg border border-border object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* 画廊 */}
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">画廊图片</h2>
            <Button type="button" variant="outline" size="sm" onClick={addGalleryItem}>
              <Plus className="size-4" />
              添加图片
            </Button>
          </div>

          <div className="space-y-3">
            {gallery.length === 0 && (
              <p className="text-sm text-muted-foreground">暂无画廊图片，点击上方按钮添加</p>
            )}
            {gallery.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setGallery((prev) => {
                      const next = [...prev]
                      next[index] = e.target.value
                      return next
                    })
                  }}
                  placeholder={`画廊图片 ${index + 1} URL`}
                  className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                <input
                  ref={(el) => {
                    galleryInputRefs.current[index] = el
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleGalleryFileChange(index, e)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => galleryInputRefs.current[index]?.click()}
                  disabled={uploadingField === `gallery-${index}`}
                >
                  <Upload className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGalleryItem(index)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* 标签 */}
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-serif text-xl font-semibold">标签</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              标签 <span className="text-muted-foreground">(逗号分隔)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Figma, iOS, Design System"
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </section>

        {/* 双语字段 */}
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-serif text-xl font-semibold">内容字段（中英双语）</h2>
          <div className="space-y-6">
            {BILINGUAL_FIELDS.map((field) => (
              <div key={field.key} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {field.label}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">中文</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={bilingual[field.key]?.zh || ""}
                        onChange={(e) => updateBilingual(field.key, "zh", e.target.value)}
                        rows={3}
                        className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    ) : (
                      <input
                        type="text"
                        value={bilingual[field.key]?.zh || ""}
                        onChange={(e) => updateBilingual(field.key, "zh", e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">English</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={bilingual[field.key]?.en || ""}
                        onChange={(e) => updateBilingual(field.key, "en", e.target.value)}
                        rows={3}
                        className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    ) : (
                      <input
                        type="text"
                        value={bilingual[field.key]?.en || ""}
                        onChange={(e) => updateBilingual(field.key, "en", e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    )}
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
            {isSubmitting ? "保存中..." : "保存修改"}
          </Button>
        </div>
      </form>
    </div>
  )
}
