"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"

interface AccessRequest {
  id: string
  company_name: string
  contact_person: string
  email: string
  reason: string | null
  status: string
  created_at: string
}

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const supabase = createClient()

  const loadRequests = async () => {
    const { data } = await supabase.from("access_requests").select("*").order("created_at", { ascending: false })
    if (data) setRequests(data as AccessRequest[])
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("access_requests").update({ status }).eq("id", id)
    loadRequests()
  }

  return (
    <ProtectedRoute>
      <AdminHeader />
      <div className="container py-8 space-y-4">
        <h1 className="text-2xl font-bold">Zugangsanfragen</h1>
        <p className="text-muted-foreground text-sm">
          Personen, die ohne Einladungslink Zugang zum Portfolio angefragt haben. Bei Freigabe erstellen Sie unter
          "Einladungslinks" einen persönlichen Link und schicken ihn per E-Mail.
        </p>

        {requests.length === 0 && <p className="text-muted-foreground">Noch keine Anfragen.</p>}

        {requests.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>
                  {r.company_name} – {r.contact_person}
                </span>
                <span className="text-xs font-normal text-muted-foreground">{r.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>{r.email}</div>
              {r.reason && <div className="text-muted-foreground">{r.reason}</div>}
              <div className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString("de-DE")}
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => updateStatus(r.id, "approved")}>
                    Freigeben
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "rejected")}>
                    Ablehnen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ProtectedRoute>
  )
}
