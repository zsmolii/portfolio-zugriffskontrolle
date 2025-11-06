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
  used_by_user_id: string | null
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
      // Generate a unique token
      const token = `invite-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`

      // Insert new invite into Supabase
      const { data, error } = await supabase
        .from("invites")
        .insert({
          token,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Refresh invites list
      const { data: allInvites } = await supabase.from("invites").select("*")
      setInvites(allInvites || [])

      // Auto-copy the new invite link
      if (data) {
        const inviteUrl = `${window.location.origin}/register?token=${data.token}`
        navigator.clipboard.writeText(inviteUrl)
        setCopiedToken(data.token)
        setTimeout(() => setCopiedToken(null), 2000)
      }
    } catch (error) {
      console.error("Error generating invite:", error)
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
                          invite.used_at
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {invite.used_at ? "Verwendet" : "Verfügbar"}
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
                    {invite.used_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Verwendet am {new Date(invite.used_at).toLocaleDateString("de-DE")}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyInvite(invite.token)}
                    disabled={!!invite.used_at}
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
