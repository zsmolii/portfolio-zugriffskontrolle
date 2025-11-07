"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface PortfolioContent {
  about_title: string
  about_intro: string
  about_description: string
  tech_stack: string[]
  github_url: string
  linkedin_url: string
  email: string
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  challenges: string
  ai_role: string
  demo_url?: string
  icon: string
  order_index: number
}

export default function ContentManagementPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState<PortfolioContent>({
    about_title: "",
    about_intro: "",
    about_description: "",
    tech_stack: [],
    github_url: "",
    linkedin_url: "",
    email: "",
  })
  const [projects, setProjects] = useState<Project[]>([])
  const [newTech, setNewTech] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const supabase = createBrowserClient()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/portfolio")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchContent = async () => {
      if (!isAdmin) return

      try {
        // Fetch portfolio content
        const { data: portfolioData, error: portfolioError } = await supabase
          .from("portfolio_content")
          .select("*")
          .single()

        if (portfolioError) throw portfolioError

        if (portfolioData) {
          setContent(portfolioData.content as PortfolioContent)
        }

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .order("order_index", { ascending: true })

        if (projectsError) throw projectsError

        setProjects(projectsData || [])
      } catch (error) {
        console.error("Error fetching content:", error)
      }
    }

    fetchContent()
  }, [isAdmin, supabase])

  const handleSaveContent = async () => {
    setSaving(true)
    setMessage("")

    try {
      const { data, error } = await supabase
        .from("portfolio_content")
        .upsert({
          id: 1,
          section: "main",
          content: content,
        })
        .select()

      if (error) {
        console.error("[v0] Error saving content:", error)
        throw error
      }

      console.log("[v0] Content saved successfully:", data)
      setMessage("Inhalte erfolgreich gespeichert!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error saving content:", error)
      setMessage("Fehler beim Speichern der Inhalte")
    } finally {
      setSaving(false)
    }
  }

  const handleAddTech = () => {
    if (newTech.trim()) {
      setContent({ ...content, tech_stack: [...content.tech_stack, newTech.trim()] })
      setNewTech("")
    }
  }

  const handleRemoveTech = (index: number) => {
    setContent({ ...content, tech_stack: content.tech_stack.filter((_, i) => i !== index) })
  }

  const handleAddProject = () => {
    const newProject: Project = {
      id: `temp-${Date.now()}`,
      title: "Neues Projekt",
      description: "Projektbeschreibung",
      technologies: [],
      challenges: "",
      ai_role: "",
      icon: "shield",
      order_index: projects.length,
    }
    setProjects([...projects, newProject])
  }

  const handleSaveProjects = async () => {
    setSaving(true)
    setMessage("")

    try {
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (deleteError) {
        console.error("[v0] Error deleting projects:", deleteError)
        throw deleteError
      }

      const projectsToInsert = projects.map((p, index) => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        challenges: p.challenges,
        ai_role: p.ai_role,
        demo_url: p.demo_url,
        icon: p.icon,
        order_index: index,
      }))

      const { data, error } = await supabase.from("projects").insert(projectsToInsert).select()

      if (error) {
        console.error("[v0] Error inserting projects:", error)
        throw error
      }

      console.log("[v0] Projects saved successfully:", data)

      setProjects(data || [])
      setMessage("Projekte erfolgreich gespeichert!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error saving projects:", error)
      setMessage("Fehler beim Speichern der Projekte")
    } finally {
      setSaving(false)
    }
  }

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    const newProjects = [...projects]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newProjects.length) return
    ;[newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]]
    setProjects(newProjects)
  }

  const handleDeleteProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
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
            <h1 className="text-3xl font-bold mb-2">Content-Management</h1>
            <p className="text-muted-foreground">Portfolio-Inhalte bearbeiten und verwalten</p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${message.includes("erfolgreich") ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
            >
              {message}
            </div>
          )}

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>Über mich Sektion</CardTitle>
              <CardDescription>Bearbeiten Sie die Inhalte der "Über mich" Sektion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_title">Titel</Label>
                <Input
                  id="about_title"
                  value={content.about_title}
                  onChange={(e) => setContent({ ...content, about_title: e.target.value })}
                  placeholder="Hallo, ich bin..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_intro">Einleitung</Label>
                <Textarea
                  id="about_intro"
                  value={content.about_intro}
                  onChange={(e) => setContent({ ...content, about_intro: e.target.value })}
                  placeholder="Kurze Einleitung..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_description">Beschreibung</Label>
                <Textarea
                  id="about_description"
                  value={content.about_description}
                  onChange={(e) => setContent({ ...content, about_description: e.target.value })}
                  placeholder="Ausführliche Beschreibung..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Tech Stack</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Neue Technologie hinzufügen..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
                  />
                  <Button onClick={handleAddTech} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.tech_stack.map((tech, index) => (
                    <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md">
                      <span className="text-sm">{tech}</span>
                      <button
                        onClick={() => handleRemoveTech(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={content.github_url}
                    onChange={(e) => setContent({ ...content, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={content.linkedin_url}
                    onChange={(e) => setContent({ ...content, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={content.email}
                    onChange={(e) => setContent({ ...content, email: e.target.value })}
                    placeholder="ihre@email.com"
                  />
                </div>
              </div>

              <Button onClick={handleSaveContent} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Wird gespeichert..." : "Inhalte speichern"}
              </Button>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle>Projekte</CardTitle>
              <CardDescription>Projekte hinzufügen, bearbeiten und neu anordnen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, index) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Projekt {index + 1}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveProject(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveProject(index, "down")}
                        disabled={index === projects.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Titel</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => {
                          const newProjects = [...projects]
                          newProjects[index].title = e.target.value
                          setProjects(newProjects)
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        value={project.icon}
                        onChange={(e) => {
                          const newProjects = [...projects]
                          newProjects[index].icon = e.target.value
                          setProjects(newProjects)
                        }}
                      >
                        <option value="warehouse">Warehouse</option>
                        <option value="chart">Chart</option>
                        <option value="shield">Shield</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Beschreibung</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => {
                        const newProjects = [...projects]
                        newProjects[index].description = e.target.value
                        setProjects(newProjects)
                      }}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Technologien (kommagetrennt)</Label>
                    <Input
                      value={project.technologies.join(", ")}
                      onChange={(e) => {
                        const newProjects = [...projects]
                        newProjects[index].technologies = e.target.value.split(",").map((t) => t.trim())
                        setProjects(newProjects)
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Herausforderungen & Lösungen</Label>
                    <Textarea
                      value={project.challenges}
                      onChange={(e) => {
                        const newProjects = [...projects]
                        newProjects[index].challenges = e.target.value
                        setProjects(newProjects)
                      }}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rolle der KI</Label>
                    <Textarea
                      value={project.ai_role}
                      onChange={(e) => {
                        const newProjects = [...projects]
                        newProjects[index].ai_role = e.target.value
                        setProjects(newProjects)
                      }}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Demo URL (optional)</Label>
                    <Input
                      value={project.demo_url || ""}
                      onChange={(e) => {
                        const newProjects = [...projects]
                        newProjects[index].demo_url = e.target.value
                        setProjects(newProjects)
                      }}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <Button onClick={handleAddProject} variant="outline" className="flex-1 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Neues Projekt hinzufügen
                </Button>
                <Button onClick={handleSaveProjects} disabled={saving} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Wird gespeichert..." : "Projekte speichern"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
