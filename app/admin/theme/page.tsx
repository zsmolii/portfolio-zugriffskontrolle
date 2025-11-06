"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Save, Palette } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface ThemeSettings {
  background_color: string
  background_image?: string
  font_family: string
}

export default function ThemeSettingsPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState<ThemeSettings>({
    background_color: "#0a0a0a",
    background_image: "",
    font_family: "Inter",
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const supabase = createBrowserClient()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/portfolio")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchTheme = async () => {
      if (!isAdmin) return

      try {
        const { data, error } = await supabase.from("theme_settings").select("*").single()

        if (error) throw error

        if (data) {
          setTheme(data)
        }
      } catch (error) {
        console.error("Error fetching theme:", error)
      }
    }

    fetchTheme()
  }, [isAdmin, supabase])

  const handleSaveTheme = async () => {
    setSaving(true)
    setMessage("")

    try {
      const { error } = await supabase
        .from("theme_settings")
        .upsert({
          id: 1,
          ...theme,
        })
        .select()

      if (error) throw error

      setMessage("Theme-Einstellungen erfolgreich gespeichert!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error saving theme:", error)
      setMessage("Fehler beim Speichern der Theme-Einstellungen")
    } finally {
      setSaving(false)
    }
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
            <h1 className="text-3xl font-bold mb-2">Theme-Einstellungen</h1>
            <p className="text-muted-foreground">Passen Sie das Aussehen Ihres Portfolios an</p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${message.includes("erfolgreich") ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
            >
              {message}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Farben & Hintergrund
              </CardTitle>
              <CardDescription>Passen Sie die Hintergrundfarbe und das Hintergrundbild an</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="background_color">Hintergrundfarbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="background_color"
                    type="color"
                    value={theme.background_color}
                    onChange={(e) => setTheme({ ...theme, background_color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={theme.background_color}
                    onChange={(e) => setTheme({ ...theme, background_color: e.target.value })}
                    placeholder="#0a0a0a"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Wählen Sie eine Hintergrundfarbe für Ihr Portfolio (Hex-Code)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background_image">Hintergrundbild URL (optional)</Label>
                <Input
                  id="background_image"
                  value={theme.background_image || ""}
                  onChange={(e) => setTheme({ ...theme, background_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Fügen Sie eine URL zu einem Hintergrundbild hinzu (überschreibt die Hintergrundfarbe)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font_family">Schriftart</Label>
                <select
                  id="font_family"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={theme.font_family}
                  onChange={(e) => setTheme({ ...theme, font_family: e.target.value })}
                >
                  <option value="Inter">Inter (Standard)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Merriweather">Merriweather (Serif)</option>
                  <option value="Georgia">Georgia (Serif)</option>
                </select>
                <p className="text-xs text-muted-foreground">Wählen Sie eine Schriftart für Ihr Portfolio</p>
              </div>

              <Button onClick={handleSaveTheme} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Wird gespeichert..." : "Theme-Einstellungen speichern"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Vorschau</CardTitle>
              <CardDescription>So wird Ihr Portfolio aussehen</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="p-8 rounded-lg border"
                style={{
                  backgroundColor: theme.background_color,
                  backgroundImage: theme.background_image ? `url(${theme.background_image})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  fontFamily: theme.font_family,
                }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Beispiel-Überschrift</h2>
                <p className="text-white/80">
                  Dies ist ein Beispieltext, um zu zeigen, wie Ihr Portfolio mit den ausgewählten Einstellungen aussehen
                  wird.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
