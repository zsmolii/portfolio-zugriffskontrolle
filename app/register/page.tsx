"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [inviteValid, setInviteValid] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const checkInvite = async () => {
      if (!token) {
        setError("Kein Einladungstoken vorhanden")
        return
      }

      try {
        console.log("[v0] Checking session...")

        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("[v0] User already logged in, logging out first...")
          await supabase.auth.signOut()
        }

        console.log("[v0] Validating token:", token)

        const { data: invite, error: inviteError } = await supabase
          .from("invites")
          .select("*")
          .eq("token", token)
          .single()

        console.log("[v0] Invite query result:", { invite, inviteError })

        if (inviteError) {
          console.error("[v0] Database error:", inviteError)
          setError(`Ungültiger Einladungstoken (DB-Fehler: ${inviteError.message})`)
          return
        }

        if (!invite) {
          console.error("[v0] Token not found in database")
          setError("Ungültiger Einladungstoken (nicht gefunden)")
          return
        }

        if (invite.is_used || invite.used_at) {
          console.error("[v0] Token already used")
          setError("Dieser Einladungstoken wurde bereits verwendet")
          return
        }

        console.log("[v0] Token is valid!")
        setInviteValid(true)
      } catch (err) {
        console.error("[v0] Error validating token:", err)
        setError("Einladungstoken konnte nicht validiert werden")
      }
    }

    checkInvite()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!inviteValid || !token) {
      setError("Ungültiger Einladungstoken")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      return
    }

    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      console.log("[v0] Starting registration...")

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/portfolio`,
        },
      })

      if (signUpError) {
        console.error("[v0] Sign up error:", signUpError)
        setError(signUpError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        console.error("[v0] No user data returned")
        setError("Konto konnte nicht erstellt werden")
        setIsLoading(false)
        return
      }

      console.log("[v0] User created:", authData.user.id)

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        company_name: companyName,
        contact_person: contactPerson,
        email: email,
        access_expires_at: expiresAt.toISOString(),
        is_active: true,
        is_admin: false,
      })

      if (profileError) {
        console.error("[v0] Profile error:", profileError)
        setError("Benutzerprofil konnte nicht erstellt werden")
        setIsLoading(false)
        return
      }

      console.log("[v0] Profile created, marking invite as used...")

      const { error: updateError } = await supabase
        .from("invites")
        .update({
          is_used: true,
          used_by: authData.user.id,
          used_at: new Date().toISOString(),
        })
        .eq("token", token)

      if (updateError) {
        console.error("[v0] Error marking invite as used:", updateError)
      } else {
        console.log("[v0] Invite marked as used")
      }

      console.log("[v0] Registration successful! Redirecting...")
      router.push("/portfolio")
      router.refresh()
    } catch (err) {
      console.error("[v0] Registration error:", err)
      setError("Ein Fehler ist bei der Registrierung aufgetreten")
      setIsLoading(false)
    }
  }

  if (!inviteValid && error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <Card className="w-full max-w-md border-border/50 shadow-2xl">
          <CardHeader>
            <CardTitle>Ungültige Einladung</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Zur Anmeldung</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registrierung</CardTitle>
          <CardDescription>Erstellen Sie Ihr Konto für 30 Tage Zugriff auf das Portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Firmenname</Label>
              <Input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Ihre Firma"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Ansprechpartner</Label>
              <Input
                id="contactPerson"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
                placeholder="Ihr vollständiger Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ihre.email@firma.de"
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
                placeholder="Mindestens 8 Zeichen"
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Passwort wiederholen"
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Konto wird erstellt..." : "Registrieren"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Bereits ein Konto?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Hier anmelden
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
