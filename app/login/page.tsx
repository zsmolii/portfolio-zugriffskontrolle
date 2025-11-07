"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout nach ${timeoutMs}ms`)), timeoutMs)),
  ])
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const supabase = createClient()

      console.log("[v0] Login attempt for:", email)
      console.log("[v0] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

      const { data, error: signInError } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        30000,
      )

      if (signInError) {
        console.error("[v0] Sign in error:", signInError)
        setError("Ungültige Anmeldedaten")
        setIsLoading(false)
        return
      }

      if (!data.user) {
        console.error("[v0] No user data returned")
        setError("Anmeldung fehlgeschlagen")
        setIsLoading(false)
        return
      }

      console.log("[v0] User authenticated:", data.user.id)
      console.log("[v0] Fetching user profile from 'users' table...")

      const profilePromise = supabase.from("users").select("*").eq("id", data.user.id).single()

      const { data: profile, error: profileError } = await withTimeout(profilePromise, 25000)

      if (profileError) {
        console.error("[v0] Profile error:", profileError)
        console.error("[v0] Error details:", {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        })

        if (profileError.message.includes('relation "public.users" does not exist')) {
          setError(
            "FEHLER: Die Datenbank-Tabelle 'users' existiert nicht. Bitte führe das SQL-Script 'SUPABASE_FIX_RLS.sql' in Supabase aus!",
          )
        } else if (profileError.code === "PGRST116") {
          setError(
            `FEHLER: Kein Benutzerprofil für ${email} in der 'users' Tabelle gefunden. Stelle sicher, dass das SQL-Script ausgeführt wurde!`,
          )
        } else if (profileError.code === "42501") {
          setError(
            "FEHLER: Zugriff verweigert. Row Level Security (RLS) blockiert den Zugriff. Bitte führe 'SUPABASE_FIX_RLS.sql' aus!",
          )
        } else {
          setError(`Fehler beim Laden des Profils: ${profileError.message} (Code: ${profileError.code})`)
        }
        setIsLoading(false)
        return
      }

      if (!profile) {
        console.error("[v0] No profile found for user:", data.user.id)
        setError(
          `FEHLER: Kein Benutzerprofil für ${email} gefunden. Bitte prüfe, ob der User in der 'users' Tabelle existiert!`,
        )
        setIsLoading(false)
        return
      }

      console.log("[v0] Profile loaded:", profile)

      if (!profile.is_active) {
        if (profile.is_admin) {
          console.log("[v0] Admin account inactive, but allowing login")
        } else {
          await supabase.auth.signOut()
          setError("Ihr Konto wurde deaktiviert")
          setIsLoading(false)
          return
        }
      }

      console.log("[v0] Login successful! Redirecting...")

      if (profile.is_admin) {
        window.location.href = "/admin"
      } else {
        window.location.href = "/portfolio"
      }
    } catch (err) {
      console.error("[v0] Unexpected error:", err)
      if (err instanceof Error && err.message.includes("Timeout")) {
        setError(
          `Zeitüberschreitung: Die Verbindung zu Supabase dauert zu lange. Bitte prüfe:\n1. Ist deine Supabase-URL korrekt? (${process.env.NEXT_PUBLIC_SUPABASE_URL})\n2. Funktioniert deine Internetverbindung?\n3. Ist Supabase erreichbar?`,
        )
      } else {
        setError(
          `Ein unerwarteter Fehler ist aufgetreten: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`,
        )
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
          <CardDescription>Geben Sie Ihre Zugangsdaten ein, um fortzufahren</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ihre.email@firma.de"
                className="transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ihr Passwort"
                className="transition-all"
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md whitespace-pre-wrap">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wird angemeldet..." : "Anmelden"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Haben Sie einen Einladungscode?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Hier registrieren
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
