"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { PortfolioHeader } from "@/components/portfolio-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"

export default function RequestExtensionPage() {
  const { user, daysRemaining, isExpired } = useAuth()
  const router = useRouter()
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [hasPendingRequest, setHasPendingRequest] = useState(false)

  const supabase = createBrowserClient()

  useEffect(() => {
    const checkPendingRequest = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("extension_requests")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "pending")

        if (error) throw error

        setHasPendingRequest((data?.length || 0) > 0)
      } catch (error) {
        console.error("Error checking pending requests:", error)
      }
    }

    checkPendingRequest()
  }, [user, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user) {
      setError("Sie müssen angemeldet sein, um eine Verlängerung anzufordern")
      return
    }

    if (reason.trim().length < 10) {
      setError("Bitte geben Sie eine ausführliche Begründung an (mindestens 10 Zeichen)")
      return
    }

    if (hasPendingRequest) {
      setError("Sie haben bereits eine offene Verlängerungsanfrage")
      return
    }

    setIsSubmitting(true)

    try {
      const { error: insertError } = await supabase.from("extension_requests").insert({
        user_id: user.id,
        company_name: user.company_name,
        requested_at: new Date().toISOString(),
        reason: reason.trim(),
        status: "pending",
      })

      if (insertError) throw insertError

      setSubmitted(true)
    } catch (err) {
      console.error("Error submitting extension request:", err)
      setError("Ein Fehler ist beim Absenden Ihrer Anfrage aufgetreten")
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <PortfolioHeader />
          <main className="container py-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-500/10 p-3">
                      <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Anfrage eingereicht</h2>
                    <p className="text-muted-foreground">
                      Ihre Verlängerungsanfrage wurde erfolgreich eingereicht. Der Administrator wird Ihre Anfrage
                      prüfen und Sie über die Entscheidung informieren.
                    </p>
                  </div>
                  <Link href="/portfolio">
                    <Button className="mt-4">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Zurück zum Portfolio
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <PortfolioHeader />

        <main className="container py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <Link href="/portfolio">
                <Button variant="outline" size="sm" className="mb-4 bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zum Portfolio
                </Button>
              </Link>
              <h1 className="text-3xl font-bold mb-2">Zugriffsverlängerung anfragen</h1>
              <p className="text-muted-foreground">
                {isExpired
                  ? "Ihr Zugriff ist abgelaufen. Fordern Sie eine Verlängerung an, um das Portfolio weiterhin anzusehen."
                  : `Sie haben noch ${daysRemaining} Tage verbleibend. Fordern Sie eine Verlängerung an, um den Zugriff aufrechtzuerhalten.`}
              </p>
            </div>

            {hasPendingRequest ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-yellow-500/10 p-3">
                        <CheckCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">Anfrage ausstehend</h2>
                      <p className="text-muted-foreground">
                        Sie haben bereits eine offene Verlängerungsanfrage. Der Administrator wird diese in Kürze
                        prüfen.
                      </p>
                    </div>
                    <Link href="/portfolio">
                      <Button variant="outline" className="mt-4 bg-transparent">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Zurück zum Portfolio
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Verlängerungsanfrage</CardTitle>
                  <CardDescription>
                    Bitte geben Sie einen Grund für Ihre Verlängerungsanfrage an. Der Administrator wird Ihre Anfrage
                    prüfen und entsprechend antworten.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Firmenname</Label>
                      <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                        {user?.company_name}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentAccess">Aktueller Zugriffsstatus</Label>
                      <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                        {isExpired ? (
                          <span className="text-destructive font-medium">Abgelaufen</span>
                        ) : (
                          <span>{daysRemaining} Tage verbleibend</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">
                        Begründung für Verlängerung <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Bitte erklären Sie, warum Sie eine Verlängerung Ihres Zugriffszeitraums benötigen..."
                        rows={6}
                        required
                        minLength={10}
                      />
                      <p className="text-xs text-muted-foreground">Mindestens 10 Zeichen</p>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-sm">Was passiert als Nächstes?</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Ihre Anfrage wird an den Administrator gesendet</li>
                        <li>Der Administrator wird Ihre Begründung prüfen</li>
                        <li>Bei Genehmigung erhalten Sie zusätzliche 30 Tage Zugriff</li>
                        <li>Sie werden über die Entscheidung benachrichtigt</li>
                      </ul>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Wird gesendet..." : "Verlängerungsanfrage absenden"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
