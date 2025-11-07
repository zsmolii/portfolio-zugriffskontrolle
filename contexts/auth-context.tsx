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
    const checkSession = async () => {
      const timeoutId = setTimeout(() => {
        console.error("[v0] Session check timeout")
        setUser(null)
        setIsLoading(false)
      }, 10000) // 10 seconds timeout

      try {
        console.log("[v0] Checking session...")
        const {
          data: { session },
        } = await supabase.auth.getSession()

        clearTimeout(timeoutId)

        if (session?.user) {
          console.log("[v0] Session found, loading profile...")
          await loadUserProfile(session.user.id)
        } else {
          console.log("[v0] No session found")
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        clearTimeout(timeoutId)
        console.error("[v0] Error checking session:", error)
        setError(null)
        setUser(null)
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
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId: string) => {
    const timeoutId = setTimeout(() => {
      console.error("[v0] Profile load timeout")
      setUser(null)
      setIsLoading(false)
    }, 8000) // 8 seconds timeout

    try {
      console.log("[v0] Loading user profile for:", userId)
      const { data: profile, error } = await supabase.from("users").select("*").eq("id", userId).single()

      clearTimeout(timeoutId)

      if (error) {
        console.error("[v0] Error loading user profile:", error)
        setError(`Fehler beim Laden des Profils: ${error.message}`)
        setUser(null)
        setIsLoading(false)
        return
      }

      if (!profile) {
        console.error("[v0] Profile not found")
        setError("Benutzerprofil nicht gefunden.")
        setUser(null)
        setIsLoading(false)
        return
      }

      console.log("[v0] User profile loaded successfully")
      setError(null)
      setUser(profile)
      setIsLoading(false)
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("[v0] Unexpected error loading user profile:", error)
      setError(null)
      setUser(null)
      setIsLoading(false)
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
