"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RequestAccessPage() {
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const supabase = createClient()
    const { error: insertError } = await supabase.from("access_requests").insert({
      company_name: companyName,
      contact_person: contactPerson,
      email,
      reason,
    })

    if (insertError) {
      setError("Anfrage konnte nicht gesendet werden. Bitte später erneut versuchen.")
      setIsLoading(false)
      return
    }

    setSubmitted(true)
    setIsLoading(false)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Danke für Ihre Anfrage</CardTitle>
            <CardDescription>
              Ihre Zugangsanfrage wurde übermittelt. Sie erhalten bei Freigabe einen persönlichen Einladungslink per
              E-Mail.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Zugang anfragen</CardTitle>
          <CardDescription>Sie haben keinen Einladungslink? Fragen Sie hier Zugang zum Portfolio an.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Firma</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Ansprechpartner</Label>
              <Input
                id="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Grund des Interesses (optional)</Label>
              <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
            </div>
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wird gesendet..." : "Anfrage senden"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
ENDOFFILE
echo done
