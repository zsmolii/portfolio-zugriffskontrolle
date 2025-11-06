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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("[v0] Checking session...")
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
        setUser(null)
      } finally {
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
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("[v0] Loading user profile for:", userId)
      const { data: profile, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        console.error("[v0] Error loading user profile:", error)
        setUser(null)
        return
      }

      console.log("[v0] User profile loaded:", profile)
      setUser(profile)
    } catch (error) {
      console.error("[v0] Error loading user profile:", error)
      setUser(null)
    }
  }

  const login = async (userId: string) => {
    await loadUserProfile(userId)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAdmin = user?.is_admin || false

  const isExpired = user ? (user.access_expires_at ? new Date(user.access_expires_at) < new Date() : false) : false

  const daysRemaining = user
    ? user.access_expires_at
      ? Math.max(0, Math.ceil((new Date(user.access_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : -1 // -1 = unbegrenzter Zugriff für Admin
    : 0

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin, isExpired, daysRemaining }}>
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
