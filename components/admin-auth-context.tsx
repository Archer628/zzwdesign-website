"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

interface AuthContextType {
  token: string | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "admin_token"

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化时从 localStorage 读取 token
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      setToken(stored)
    }
    setIsInitialized(true)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.success && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token)
        setToken(data.token)
        return { success: true }
      }

      return { success: false, error: data.error || "登录失败" }
    } catch {
      return { success: false, error: "网络错误，请稍后重试" }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  const isAuthenticated = !!token

  if (!isInitialized) {
    return null
  }

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
