"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  company_name: string
  contact_person: string
  email: string
  created_at: string
  access_expires_at: string
  is_active: boolean
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userId: string) => void
  logout: () => void
  isAdmin: boolean
  isExpired: boolean
  daysRemaining: number
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("[v0] Checking session...")
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
          console.log("[v0] No session found")
          setUser(null)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        console.log("[v0] User profile loaded:", data.user)
        setUser(data.user)
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Error checking session:", error)
        setUser(null)
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (userId: string) => {
    // Nach Login wird die Seite neu geladen, daher kein manuelles Laden nötig
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setError(null)
      window.location.href = "/login"
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const isAdmin = user?.is_admin || false

  const isExpired = user ? (user.access_expires_at ? new Date(user.access_expires_at) < new Date() : false) : false

  const daysRemaining = user
    ? user.access_expires_at
      ? Math.max(0, Math.ceil((new Date(user.access_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : -1
    : 0

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin, isExpired, daysRemaining, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
