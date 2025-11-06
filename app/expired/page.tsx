"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"

export default function ExpiredPage() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold">Zugriff abgelaufen</CardTitle>
          </div>
          <CardDescription>Ihre 30-Tage-Zugriffsperiode ist beendet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ihr Zugriff auf das Portfolio ist abgelaufen. Wenn Sie das Portfolio weiterhin ansehen möchten, kontaktieren
            Sie bitte den Administrator, um eine Verlängerung zu beantragen.
          </p>
          <Button onClick={handleLogout} className="w-full">
            Zurück zur Anmeldung
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
