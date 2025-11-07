"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

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

  const supabase = createBrowserClient()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("[v0] Session check timeout - forcing loading to false")
      setIsLoading(false)
      setError("Zeitüberschreitung beim Laden der Session")
    }, 10000) // 10 Sekunden Timeout

    const checkSession = async () => {
      try {
        console.log("[v0] Checking session...")
        console.log("[v0] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET")

        const {
          data: { session },
        } = await supabase.auth.getSession()

        console.log("[v0] Session:", session ? "exists" : "none")

        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("[v0] Error checking session:", error)
        setError("Fehler beim Laden der Session")
        setUser(null)
      } finally {
        clearTimeout(timeoutId)
        setIsLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event)
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("[v0] Loading user profile for:", userId)

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout beim Laden des Profils")), 8000),
      )

      const profilePromise = supabase.from("users").select("*").eq("id", userId).single()

      const { data: profile, error } = (await Promise.race([profilePromise, timeoutPromise])) as any

      if (error) {
        console.error("[v0] Error loading user profile:", error)
        console.error("[v0] Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })

        if (error.code === "PGRST116") {
          setError("Benutzerprofil nicht gefunden. Bitte führe das SQL-Script aus.")
        } else if (error.code === "42P17") {
          setError("RLS-Policy-Fehler: Infinite recursion. Bitte führe FIX_RLS_RECURSION.sql aus.")
        } else if (error.message.includes('relation "public.users" does not exist')) {
          setError("Datenbank-Tabelle 'users' existiert nicht. Bitte führe das SQL-Script aus.")
        } else if (error.message.includes("Timeout")) {
          setError("Zeitüberschreitung beim Laden des Profils. Prüfe deine Internetverbindung.")
        } else {
          setError(`Fehler beim Laden des Profils: ${error.message} (Code: ${error.code || "unknown"})`)
        }
        setUser(null)
        return
      }

      if (!profile) {
        console.error("[v0] No profile found for user:", userId)
        setError("Benutzerprofil nicht gefunden. Bitte führe das SQL-Script aus.")
        setUser(null)
        return
      }

      console.log("[v0] User profile loaded successfully:", profile)
      setError(null)
      setUser(profile)
    } catch (error) {
      console.error("[v0] Unexpected error loading user profile:", error)
      if (error instanceof Error && error.message.includes("Timeout")) {
        setError("Zeitüberschreitung beim Laden des Profils")
      } else {
        setError("Unerwarteter Fehler beim Laden des Profils")
      }
      setUser(null)
    }
  }

  const login = async (userId: string) => {
    await loadUserProfile(userId)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setError(null)
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
