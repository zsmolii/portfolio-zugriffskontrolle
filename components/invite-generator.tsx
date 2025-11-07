"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, Check, Plus } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface InviteToken {
  id: string
  token: string
  created_at: string
  used_at: string | null
  used_by: string | null
  is_used: boolean
  expires_at: string
}

export function InviteGenerator() {
  const [invites, setInvites] = useState<InviteToken[]>([])
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const { data, error } = await supabase.from("invites").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setInvites(data || [])
      } catch (error) {
        console.error("Error fetching invites:", error)
      }
    }

    fetchInvites()
  }, [supabase])

  const handleGenerateInvite = async () => {
    try {
      console.log("[v0] Generating new invite...")

      // Generate a unique token
      const token = `invite-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      console.log("[v0] Token generated:", token)

      const { data, error } = await supabase
        .from("invites")
        .insert({
          token,
          is_used: false,
          used_at: null,
          used_by: null,
          expires_at: expiresAt.toISOString(),
          max_uses: 1,
          current_uses: 0,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error inserting invite:", error)
        alert(`Fehler beim Erstellen des Einladungslinks: ${error.message}`)
        return
      }

      console.log("[v0] Invite created successfully:", data)

      const { data: allInvites, error: fetchError } = await supabase
        .from("invites")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("[v0] Error fetching invites:", fetchError)
      } else {
        setInvites(allInvites || [])
      }

      if (data) {
        const inviteUrl = `${window.location.origin}/register?token=${data.token}`
        navigator.clipboard.writeText(inviteUrl)
        setCopiedToken(data.token)
        setTimeout(() => setCopiedToken(null), 2000)
        alert(`Einladungslink erfolgreich erstellt und in die Zwischenablage kopiert!`)
      }
    } catch (error) {
      console.error("[v0] Error generating invite:", error)
      alert("Fehler beim Erstellen des Einladungslinks. Bitte versuchen Sie es erneut.")
    }
  }

  const handleCopyInvite = (token: string) => {
    const inviteUrl = `${window.location.origin}/register?token=${token}`
    navigator.clipboard.writeText(inviteUrl)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Einladungslinks</CardTitle>
        <CardDescription>Einladungslinks für neue Unternehmen erstellen und verwalten</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateInvite} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Neuen Einladungslink erstellen
        </Button>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Erstellte Einladungen</h3>
          {invites.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Einladungen erstellt</p>
          ) : (
            <div className="space-y-2">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          invite.is_used
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {invite.is_used ? "Verwendet" : "Verfügbar"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Erstellt: {new Date(invite.created_at).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                    <Input
                      value={`${window.location.origin}/register?token=${invite.token}`}
                      readOnly
                      className="text-xs font-mono"
                    />
                    {invite.is_used && invite.used_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Verwendet am {new Date(invite.used_at).toLocaleDateString("de-DE")}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyInvite(invite.token)}
                    disabled={invite.is_used}
                  >
                    {copiedToken === invite.token ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
