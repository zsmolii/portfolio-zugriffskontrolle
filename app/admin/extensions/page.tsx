"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface ExtensionRequest {
  id: string
  user_id: string
  company_name: string
  requested_at: string
  reason: string
  status: "pending" | "approved" | "denied"
  reviewed_at: string | null
  reviewed_by: string | null
}

export default function ExtensionsPage() {
  const { isAdmin, isLoading, user } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<ExtensionRequest[]>([])

  const supabase = createBrowserClient()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/portfolio")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isAdmin) return

      try {
        const { data: extensionRequests, error } = await supabase
          .from("extension_requests")
          .select("*")
          .order("requested_at", { ascending: false })

        if (error) throw error

        setRequests(extensionRequests || [])
      } catch (error) {
        console.error("Error fetching extension requests:", error)
      }
    }

    fetchRequests()
  }, [isAdmin, supabase])

  const handleReview = async (requestId: string, status: "approved" | "denied") => {
    if (!user) return

    try {
      // Update extension request
      const { error: updateError } = await supabase
        .from("extension_requests")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", requestId)

      if (updateError) throw updateError

      // If approved, extend user's access by 30 days
      if (status === "approved") {
        const request = requests.find((r) => r.id === requestId)
        if (request) {
          const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          const { error: userUpdateError } = await supabase
            .from("users")
            .update({
              expires_at: newExpiresAt,
              is_active: true,
            })
            .eq("id", request.user_id)

          if (userUpdateError) throw userUpdateError
        }
      }

      // Refresh requests list
      const { data: extensionRequests } = await supabase.from("extension_requests").select("*")
      setRequests(extensionRequests || [])
    } catch (error) {
      console.error("Error reviewing extension request:", error)
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const reviewedRequests = requests.filter((r) => r.status !== "pending")

  if (!isAdmin) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader />

        <main className="container py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Verlängerungsanfragen</h1>
            <p className="text-muted-foreground">Zugriffsverlängerungen prüfen und verwalten</p>
          </div>

          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Offene Anfragen ({pendingRequests.length})</CardTitle>
              <CardDescription>Anfragen, die auf Ihre Prüfung warten</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Keine offenen Anfragen</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{request.company_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Angefragt am {new Date(request.requested_at).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                          <Clock className="h-3 w-3 mr-1" />
                          Offen
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Begründung:</p>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{request.reason}</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleReview(request.id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Genehmigen (30 Tage)
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReview(request.id, "denied")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Ablehnen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviewed Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Bearbeitete Anfragen ({reviewedRequests.length})</CardTitle>
              <CardDescription>Bereits geprüfte Verlängerungsanfragen</CardDescription>
            </CardHeader>
            <CardContent>
              {reviewedRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Noch keine bearbeiteten Anfragen</p>
              ) : (
                <div className="space-y-4">
                  {reviewedRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3 opacity-75">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{request.company_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Angefragt am {new Date(request.requested_at).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <Badge
                          variant={request.status === "approved" ? "default" : "destructive"}
                          className={request.status === "approved" ? "bg-green-500" : ""}
                        >
                          {request.status === "approved" ? "Genehmigt" : "Abgelehnt"}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Begründung:</p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>

                      {request.reviewed_at && (
                        <p className="text-xs text-muted-foreground">
                          Geprüft am {new Date(request.reviewed_at).toLocaleDateString("de-DE")}
                        </p>
                      )}
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
