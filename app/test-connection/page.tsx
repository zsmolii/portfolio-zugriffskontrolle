"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestConnectionPage() {
  const [status, setStatus] = useState<"testing" | "success" | "error">("testing")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      setStatus("testing")
      setMessage("Teste Verbindung zu Supabase...")

      const supabase = createBrowserClient()

      // Test 1: Verbindung testen
      const { data: testData, error: testError } = await supabase.from("users").select("count").limit(1)

      if (testError) {
        throw new Error(`Datenbankfehler: ${testError.message}`)
      }

      // Test 2: Auth-Status prüfen
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error(`Auth-Fehler: ${sessionError.message}`)
      }

      // Test 3: Umgebungsvariablen prüfen
      const envVars = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }

      setStatus("success")
      setMessage("Verbindung erfolgreich!")
      setDetails({
        database: "Verbunden",
        session: session ? "Angemeldet" : "Nicht angemeldet",
        user: session?.user?.email || "Kein User",
        envVars,
      })
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message)
      setDetails({
        error: error.toString(),
        stack: error.stack,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Supabase Verbindungstest</CardTitle>
          <CardDescription>Überprüfe die Verbindung zu deiner Supabase-Datenbank</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status === "testing"
                  ? "bg-yellow-500 animate-pulse"
                  : status === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
              }`}
            />
            <span className="font-medium">{message}</span>
          </div>

          {details && (
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">{JSON.stringify(details, null, 2)}</pre>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={testConnection}>Erneut testen</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/login")}>
              Zum Login
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-semibold">Erwartete Umgebungsvariablen:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL: https://bobduitebgjykgjxcwzl.supabase.co</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGci...</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
