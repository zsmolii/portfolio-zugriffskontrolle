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
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const router = useRouter()

  const addDebug = (message: string) => {
    console.log("[v0 LOGIN]", message)
    setDebugInfo((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]} - ${message}`])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setDebugInfo([])

    addDebug(`Starting login for: ${email}`)

    try {
      const supabase = createClient()
      addDebug(`Supabase client created`)
      addDebug(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET"}`)

      addDebug(`Attempting authentication...`)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        addDebug(`Auth error: ${signInError.message}`)
        setError(`Anmeldefehler: ${signInError.message}`)
        setIsLoading(false)
        return
      }

      if (!data.user) {
        addDebug(`No user data returned`)
        setError("Keine Benutzerdaten erhalten")
        setIsLoading(false)
        return
      }

      addDebug(`User authenticated: ${data.user.id}`)

      addDebug(`Loading user profile from database...`)
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        addDebug(`Profile error: ${profileError.message} (Code: ${profileError.code})`)
        setError(`Profilfehler: ${profileError.message} (Code: ${profileError.code})`)
        setIsLoading(false)
        return
      }

      if (!profile) {
        addDebug(`No profile found in database`)
        setError("Kein Benutzerprofil gefunden")
        setIsLoading(false)
        return
      }

      addDebug(`Profile loaded: Admin=${profile.is_admin}, Active=${profile.is_active}`)

      if (!profile.is_active && !profile.is_admin) {
        addDebug(`Account is not active`)
        await supabase.auth.signOut()
        setError("Ihr Konto ist nicht aktiv")
        setIsLoading(false)
        return
      }

      addDebug(`Login successful! Redirecting to ${profile.is_admin ? "/admin" : "/portfolio"}`)

      if (profile.is_admin) {
        router.push("/admin")
      } else {
        router.push("/portfolio")
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (err) {
      addDebug(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
      setError(`Unerwarteter Fehler: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`)
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
            {debugInfo.length > 0 && (
              <div className="p-3 text-xs bg-muted border border-border rounded-md max-h-40 overflow-y-auto">
                <div className="font-semibold mb-1">Debug-Log:</div>
                {debugInfo.map((info, i) => (
                  <div key={i} className="font-mono">
                    {info}
                  </div>
                ))}
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
