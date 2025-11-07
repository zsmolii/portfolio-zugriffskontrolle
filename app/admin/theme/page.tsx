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
  text_color?: string
  nav_color?: string
  heading_color?: string
  heading_size?: string
  heading_font?: string
  body_text_font?: string
  body_text_color?: string
  body_text_size?: string
  button_color?: string
}

export default function ThemeSettingsPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState<ThemeSettings>({
    background_color: "#0a0a0a",
    background_image: "",
    font_family: "Inter",
    text_color: "#ffffff",
    nav_color: "#1a1a1a",
    heading_color: "#ffffff",
    heading_size: "2rem",
    heading_font: "Inter",
    body_text_font: "Inter",
    body_text_color: "#e5e5e5",
    body_text_size: "1rem",
    button_color: "#3b82f6",
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
      console.log("[v0] Saving theme settings:", theme)

      const { data: existing, error: fetchError } = await supabase
        .from("theme_settings")
        .select("id")
        .limit(1)
        .maybeSingle()

      if (fetchError) {
        console.error("[v0] Error checking existing theme:", fetchError)
      }

      let result
      if (existing) {
        result = await supabase
          .from("theme_settings")
          .update({
            background_color: theme.background_color,
            background_image: theme.background_image || null,
            font_family: theme.font_family,
            text_color: theme.text_color || "#ffffff",
            nav_color: theme.nav_color || "#1a1a1a",
            heading_color: theme.heading_color || "#ffffff",
            heading_size: theme.heading_size || "2rem",
            heading_font: theme.heading_font || "Inter",
            body_text_font: theme.body_text_font || "Inter",
            body_text_color: theme.body_text_color || "#e5e5e5",
            body_text_size: theme.body_text_size || "1rem",
            button_color: theme.button_color || "#3b82f6",
          })
          .eq("id", existing.id)
          .select()
      } else {
        result = await supabase
          .from("theme_settings")
          .insert({
            background_color: theme.background_color,
            background_image: theme.background_image || null,
            font_family: theme.font_family,
            text_color: theme.text_color || "#ffffff",
            nav_color: theme.nav_color || "#1a1a1a",
            heading_color: theme.heading_color || "#ffffff",
            heading_size: theme.heading_size || "2rem",
            heading_font: theme.heading_font || "Inter",
            body_text_font: theme.body_text_font || "Inter",
            body_text_color: theme.body_text_color || "#e5e5e5",
            body_text_size: theme.body_text_size || "1rem",
            button_color: theme.button_color || "#3b82f6",
          })
          .select()
      }

      if (result.error) {
        console.error("[v0] Error saving theme:", result.error)
        throw result.error
      }

      console.log("[v0] Theme saved successfully:", result.data)
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

              <div className="space-y-2">
                <Label htmlFor="text_color">Textfarbe</Label>
                <Input
                  id="text_color"
                  type="color"
                  value={theme.text_color}
                  onChange={(e) => setTheme({ ...theme, text_color: e.target.value })}
                  className="w-20 h-10"
                />
                <p className="text-xs text-muted-foreground">Wählen Sie eine Textfarbe für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nav_color">Navigationsfarbe</Label>
                <Input
                  id="nav_color"
                  type="color"
                  value={theme.nav_color}
                  onChange={(e) => setTheme({ ...theme, nav_color: e.target.value })}
                  className="w-20 h-10"
                />
                <p className="text-xs text-muted-foreground">Wählen Sie eine Navigationsfarbe für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading_color">Überschriftfarbe</Label>
                <Input
                  id="heading_color"
                  type="color"
                  value={theme.heading_color}
                  onChange={(e) => setTheme({ ...theme, heading_color: e.target.value })}
                  className="w-20 h-10"
                />
                <p className="text-xs text-muted-foreground">Wählen Sie eine Überschriftfarbe für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading_size">Überschriftgröße</Label>
                <Input
                  id="heading_size"
                  value={theme.heading_size}
                  onChange={(e) => setTheme({ ...theme, heading_size: e.target.value })}
                  placeholder="2rem"
                />
                <p className="text-xs text-muted-foreground">Wählen Sie eine Überschriftgröße für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading_font">Überschriftschriftart</Label>
                <select
                  id="heading_font"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={theme.heading_font}
                  onChange={(e) => setTheme({ ...theme, heading_font: e.target.value })}
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
                <p className="text-xs text-muted-foreground">Wählen Sie eine Überschriftschriftart für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body_text_font">Körperschriftart</Label>
                <select
                  id="body_text_font"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={theme.body_text_font}
                  onChange={(e) => setTheme({ ...theme, body_text_font: e.target.value })}
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
                <p className="text-xs text-muted-foreground">Wählen Sie eine Körperschriftart für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body_text_color">Körperschriftfarbe</Label>
                <Input
                  id="body_text_color"
                  type="color"
                  value={theme.body_text_color}
                  onChange={(e) => setTheme({ ...theme, body_text_color: e.target.value })}
                  className="w-20 h-10"
                />
                <p className="text-xs text-muted-foreground">Wählen Sie eine Körperschriftfarbe für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body_text_size">Körperschriftgröße</Label>
                <Input
                  id="body_text_size"
                  value={theme.body_text_size}
                  onChange={(e) => setTheme({ ...theme, body_text_size: e.target.value })}
                  placeholder="1rem"
                />
                <p className="text-xs text-muted-foreground">Wählen Sie eine Körperschriftgröße für Ihr Portfolio</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_color">Buttonfarbe</Label>
                <Input
                  id="button_color"
                  type="color"
                  value={theme.button_color}
                  onChange={(e) => setTheme({ ...theme, button_color: e.target.value })}
                  className="w-20 h-10"
                />
                <p className="text-xs text-muted-foreground">Wählen Sie eine Buttonfarbe für Ihr Portfolio</p>
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
                  color: theme.text_color,
                  navColor: theme.nav_color,
                  headingColor: theme.heading_color,
                  headingSize: theme.heading_size,
                  headingFont: theme.heading_font,
                  bodyTextColor: theme.body_text_color,
                  bodyTextSize: theme.body_text_size,
                  buttonColor: theme.button_color,
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
