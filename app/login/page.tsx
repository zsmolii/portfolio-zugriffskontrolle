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

    console.log("[v0 LOGIN] Starting login for:", email)

    try {
      const supabase = createClient()

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("[v0 LOGIN] SignIn error:", signInError)
        setError(
          signInError.message === "Invalid login credentials"
            ? "E-Mail oder Passwort ist falsch"
            : signInError.message,
        )
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setError("Anmeldung fehlgeschlagen")
        setIsLoading(false)
        return
      }

      console.log("[v0 LOGIN] Auth successful, fetching profile for:", authData.user.id)

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("is_admin, is_active")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (profileError) {
        console.error("[v0 LOGIN] Profile fetch error:", profileError)
        setError(`Profil konnte nicht geladen werden: ${profileError.message}`)
        setIsLoading(false)
        return
      }

      if (!profile) {
        setError("Kein Nutzerprofil gefunden. Bitte Admin kontaktieren.")
        setIsLoading(false)
        return
      }

      if (profile.is_active === false) {
        setError("Dieses Konto ist deaktiviert.")
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      const redirectUrl = profile.is_admin ? "/admin" : "/portfolio"
      console.log("[v0 LOGIN] Redirecting to:", redirectUrl)

      router.push(redirectUrl)
      router.refresh()
    } catch (err) {
      console.error("[v0 LOGIN] Unexpected error:", err)
      setError("Unerwarteter Fehler beim Anmelden")
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
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
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
