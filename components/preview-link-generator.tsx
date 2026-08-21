"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Copy, Check, Plus, Trash2 } from "lucide-react"

interface PreviewLink {
  id: string
  token: string
  used_at: string | null
  expires_at: string
  created_at: string
}

export function PreviewLinkGenerator() {
  const [links, setLinks] = useState<PreviewLink[]>([])
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const supabase = createClient()

  const loadLinks = async () => {
    const { data } = await supabase.from("preview_links").select("*").order("created_at", { ascending: false })
    if (data) setLinks(data as PreviewLink[])
  }

  useEffect(() => {
    loadLinks()
  }, [])

  const handleCreate = async () => {
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("preview_links").insert({
      token,
      expires_at: expiresAt.toISOString(),
      created_by: user?.id,
    })

    loadLinks()
  }

  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/preview?token=${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Diesen Sofort-Ansicht-Link wirklich löschen?")) return
    await supabase.from("preview_links").delete().eq("id", id)
    loadLinks()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sofort-Ansicht-Links</CardTitle>
        <CardDescription>
          Einmalig nutzbare Links ohne Registrierung – ideal für Bewerbungen, damit Recruiter direkt reinschauen
          können.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Neuen Sofort-Link erstellen
        </Button>

        {links.map((link) => {
          const isUsed = !!link.used_at
          const isExpired = new Date(link.expires_at) < new Date()
          return (
            <div key={link.id} className="flex items-center justify-between border rounded-md p-3">
              <div className="text-sm">
                <div>{isUsed ? "Bereits verwendet" : isExpired ? "Abgelaufen" : "Noch nicht verwendet"}</div>
                <div className="text-muted-foreground text-xs">
                  Gültig bis {new Date(link.expires_at).toLocaleDateString("de-DE")}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleCopy(link.token)} disabled={isUsed}>
                  {copiedToken === link.token ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(link.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
