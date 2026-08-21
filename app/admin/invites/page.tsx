"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { InviteGenerator } from "@/components/invite-generator"
import { PreviewLinkGenerator } from "@/components/preview-link-generator"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function InvitesPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/portfolio")
    }
  }, [isAdmin, isLoading, router])

  if (!isAdmin) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Einladungsverwaltung</h1>
              <p className="text-muted-foreground">
                Registrierungslinks (30 Tage Zugang) und einmalige Sofort-Ansicht-Links
              </p>
            </div>
          </div>

          <InviteGenerator />
          <PreviewLinkGenerator />

          <Link href="/admin/access-requests">
            <Button variant="outline" className="w-full bg-transparent">
              Zugangsanfragen ansehen
            </Button>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}
