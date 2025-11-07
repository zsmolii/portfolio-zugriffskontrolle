"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Activity } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface ActivityLog {
  id: string
  created_at: string
  type: "login" | "registration" | "invite_created" | "invite_used" | "extension_requested" | "extension_reviewed"
  user_id?: string
  details: string
}

export default function LogsPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<ActivityLog[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/portfolio")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchLogs = async () => {
      if (!isAdmin) return

      try {
        const { data, error } = await supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        setLogs(data || [])
      } catch (error) {
        console.error("Error fetching logs:", error)
      }
    }

    fetchLogs()
  }, [isAdmin, supabase])

  const getLogTypeColor = (type: ActivityLog["type"]) => {
    switch (type) {
      case "login":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      case "registration":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "invite_created":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400"
      case "invite_used":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
      case "extension_requested":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      case "extension_reviewed":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400"
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
    }
  }

  const getLogTypeLabel = (type: ActivityLog["type"]) => {
    const labels: Record<ActivityLog["type"], string> = {
      login: "Anmeldung",
      registration: "Registrierung",
      invite_created: "Einladung erstellt",
      invite_used: "Einladung verwendet",
      extension_requested: "Verlängerung angefragt",
      extension_reviewed: "Verlängerung geprüft",
    }
    return labels[type] || type
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
            <h1 className="text-3xl font-bold mb-2">Aktivitätsprotokolle</h1>
            <p className="text-muted-foreground">Systemaktivitäten und Benutzeraktionen überwachen</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Letzte Aktivitäten ({logs.length})
              </CardTitle>
              <CardDescription>Alle Systemereignisse und Benutzeraktionen</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Noch keine Aktivitätsprotokolle</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Badge variant="outline" className={`${getLogTypeColor(log.type)} shrink-0`}>
                        {getLogTypeLabel(log.type)}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.created_at).toLocaleString("de-DE")}
                        </p>
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
