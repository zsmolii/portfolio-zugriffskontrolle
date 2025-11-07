"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Users, Clock, LinkIcon, Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function AdminDashboardPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    pendingExtensions: 0,
    totalInvites: 0,
    usedInvites: 0,
    recentLogs: 0,
  })

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/portfolio")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return

      try {
        const supabase = createClient()

        const { data: users, error: usersError } = await supabase.from("users").select("*").eq("is_admin", false)

        if (usersError) throw usersError

        const activeUsers = users?.filter((u) => u.is_active && new Date(u.access_expires_at) > new Date()) || []

        const { data: extensions, error: extensionsError } = await supabase
          .from("extension_requests")
          .select("*")
          .eq("status", "pending")

        if (extensionsError) throw extensionsError

        const { data: invites, error: invitesError } = await supabase.from("invites").select("*")

        if (invitesError) throw invitesError

        const usedInvites = invites?.filter((i) => i.is_used) || []

        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const { data: logs, error: logsError } = await supabase
          .from("activity_logs")
          .select("*")
          .gte("created_at", yesterday)

        if (logsError) throw logsError

        setStats({
          totalCompanies: users?.length || 0,
          activeCompanies: activeUsers.length,
          pendingExtensions: extensions?.length || 0,
          totalInvites: invites?.length || 0,
          usedInvites: usedInvites.length,
          recentLogs: logs?.length || 0,
        })
      } catch (error) {
        console.error("Fehler beim Laden der Statistiken:", error)
      }
    }

    fetchStats()
  }, [isAdmin])

  if (!isAdmin) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader />

        <main className="container py-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Übersicht</h1>
            <p className="text-muted-foreground">Portfolio-Zugriff verwalten und Aktivitäten überwachen</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Firmen Gesamt</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                <p className="text-xs text-muted-foreground">{stats.activeCompanies} derzeit aktiv</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offene Verlängerungen</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingExtensions}</div>
                <p className="text-xs text-muted-foreground">Warten auf Prüfung</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Einladungslinks</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvites}</div>
                <p className="text-xs text-muted-foreground">{stats.usedInvites} verwendet</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Letzte Aktivitäten</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentLogs}</div>
                <p className="text-xs text-muted-foreground">Letzte 24 Stunden</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Portfolio Vorschau</CardTitle>
                <CardDescription>Sehen Sie Ihr Portfolio, wie es andere sehen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Aktive Firmen</span>
                  <span className="text-sm font-medium">{stats.activeCompanies}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Portfolio-Zugriffe</span>
                  <span className="text-sm font-medium">{stats.totalCompanies}</span>
                </div>
                <div className="pt-2 space-y-2">
                  <Button className="w-full" variant="default" asChild>
                    <Link href="/portfolio">Portfolio ansehen</Link>
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" asChild>
                    <Link href="/admin/content">Inhalte bearbeiten</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Schnellzugriff</CardTitle>
                <CardDescription>Häufig verwendete Verwaltungsaufgaben</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/invites">
                  <Button className="w-full bg-transparent" variant="outline">
                    Einladungslink erstellen
                  </Button>
                </Link>
                <Link href="/admin/companies">
                  <Button className="w-full bg-transparent" variant="outline">
                    Firmen verwalten
                  </Button>
                </Link>
                <Link href="/admin/extensions">
                  <Button className="w-full bg-transparent" variant="outline">
                    Verlängerungsanträge prüfen
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button className="w-full bg-transparent" variant="outline">
                    Einstellungen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Systemstatus</CardTitle>
                <CardDescription>Aktuelle Systeminformationen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Speicher-Typ</span>
                  <span className="text-sm font-medium">Supabase</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Authentifizierung</span>
                  <span className="text-sm font-medium">Aktiv</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Session-Timeout</span>
                  <span className="text-sm font-medium">24 Stunden</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Standard-Zugriffszeit</span>
                  <span className="text-sm font-medium">30 Tage</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
