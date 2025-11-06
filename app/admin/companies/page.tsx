"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth, type User } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function CompaniesPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [companies, setCompanies] = useState<User[]>([])

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/portfolio")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!isAdmin) return

      try {
        const supabase = createClient()

        const { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("is_admin", false)
          .order("created_at", { ascending: false })

        if (error) throw error

        setCompanies(users || [])
      } catch (error) {
        console.error("Fehler beim Laden der Firmen:", error)
      }
    }

    fetchCompanies()
  }, [isAdmin])

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()

      const { error } = await supabase.from("users").update({ is_active: !currentStatus }).eq("id", userId)

      if (error) throw error

      const { data: users } = await supabase.from("users").select("*").eq("is_admin", false)
      setCompanies(users || [])
    } catch (error) {
      console.error("Fehler beim Ändern des Status:", error)
    }
  }

  const getDaysRemaining = (expiresAt: string) => {
    return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (!isAdmin) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader />

        <main className="container py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Firmenverwaltung</h1>
            <p className="text-muted-foreground">Registrierte Firmen anzeigen und verwalten</p>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Registrierte Firmen ({companies.length})</CardTitle>
              <CardDescription>Alle Firmen mit Portfolio-Zugriff</CardDescription>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Noch keine Firmen registriert</p>
              ) : (
                <div className="space-y-4">
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="border border-border/50 rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{company.company_name}</h3>
                          <p className="text-sm text-muted-foreground">Kontakt: {company.contact_person}</p>
                          <p className="text-sm text-muted-foreground">E-Mail: {company.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {company.is_active ? (
                            <Badge variant="default" className="bg-green-500">
                              Aktiv
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inaktiv</Badge>
                          )}
                          {isExpired(company.access_expires_at) ? (
                            <Badge variant="destructive">Abgelaufen</Badge>
                          ) : (
                            <Badge variant="outline">{getDaysRemaining(company.access_expires_at)} Tage übrig</Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Registriert</p>
                          <p className="font-medium">{new Date(company.created_at).toLocaleDateString("de-DE")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Läuft ab</p>
                          <p className="font-medium">
                            {new Date(company.access_expires_at).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium">{company.is_active ? "Aktiv" : "Deaktiviert"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Benutzer-ID</p>
                          <p className="font-mono text-xs">{company.id.slice(0, 12)}...</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant={company.is_active ? "destructive" : "default"}
                          onClick={() => handleToggleActive(company.id, company.is_active)}
                        >
                          {company.is_active ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Deaktivieren
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aktivieren
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
