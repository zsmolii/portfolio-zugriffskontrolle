"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { PortfolioHeader } from "@/components/portfolio-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Mail, Github, Linkedin, ExternalLink, Clock, Warehouse, Baseline as ChartLine, Shield } from "lucide-react"
import Link from "next/link"
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
}

interface ThemeSettings {
  background_color: string
  background_image?: string
  font_family: string
}

export default function PortfolioPage() {
  const { user, daysRemaining, isExpired, isAdmin } = useAuth()
  const [content, setContent] = useState<PortfolioContent | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [theme, setTheme] = useState<ThemeSettings | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchContent = async () => {
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

        // Fetch theme settings
        const { data: themeData, error: themeError } = await supabase.from("theme_settings").select("*").single()

        if (themeError) throw themeError

        setTheme(themeData)
      } catch (error) {
        console.error("Error fetching content:", error)
      }
    }

    fetchContent()
  }, [supabase])

  // Apply theme settings
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty("--portfolio-bg", theme.background_color)
      if (theme.background_image) {
        document.body.style.backgroundImage = `url(${theme.background_image})`
        document.body.style.backgroundSize = "cover"
        document.body.style.backgroundAttachment = "fixed"
      }
      if (theme.font_family) {
        document.documentElement.style.setProperty("--portfolio-font", theme.font_family)
      }
    }
  }, [theme])

  const getProjectIcon = (iconName: string) => {
    switch (iconName) {
      case "warehouse":
        return <Warehouse className="h-6 w-6" />
      case "chart":
        return <ChartLine className="h-6 w-6" />
      case "shield":
        return <Shield className="h-6 w-6" />
      default:
        return <ExternalLink className="h-6 w-6" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <PortfolioHeader />

        <main className="container py-8 space-y-16">
          {/* Extension Request Banner */}
          {user && !isAdmin && (daysRemaining <= 7 || isExpired) && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    {isExpired ? "Ihr Zugriff ist abgelaufen" : "Ihr Zugriff läuft bald ab"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {isExpired
                      ? "Fordern Sie eine Verlängerung an, um dieses Portfolio weiterhin anzusehen."
                      : `Sie haben noch ${daysRemaining} Tage verbleibend. Fordern Sie eine Verlängerung an, um den Zugriff aufrechtzuerhalten.`}
                  </p>
                  <Link href="/portfolio/request-extension">
                    <Button size="sm">Verlängerung anfragen</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <section className="text-center space-y-4 py-12">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              {content?.about_title || "Hallo, ich bin Zaid Smolii"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {content?.about_intro ||
                "Autodidaktischer Entwickler mit Schwerpunkt auf praxisorientierter Softwareentwicklung"}
            </p>
          </section>

          {/* About Section */}
          <section id="about" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Über mich</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {content?.about_description ||
                      "Ich bin ein autodidaktischer Entwickler mit Schwerpunkt auf praxisorientierter Softwareentwicklung. Ich verstehe Architektur, Logik und Systemdesign – und nutze KI-Tools gezielt, um Entwicklungsprozesse zu beschleunigen."}
                  </p>
                  <p>
                    Mein Fokus liegt auf funktionalen, sauberen und nachvollziehbaren Lösungen – egal ob Web-Apps,
                    Datenverarbeitung oder Prozessautomatisierung.
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {(content?.tech_stack || ["Python", "JavaScript", "Node.js", "React", "SQL", "Docker", "Git"]).map(
                      (tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 flex gap-4">
                  {content?.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={content.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {content?.linkedin_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={content.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {content?.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${content.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        E-Mail
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Projects Section */}
          <section id="projects" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Komplexe Projekte, Reale Lösungen</h2>
            <p className="text-muted-foreground mb-6">
              Hier finden Sie einen Einblick in reale Anwendungen, die von Grund auf entwickelt wurden.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getProjectIcon(project.icon)}
                      {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-primary">Technologien</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-primary">Herausforderungen & Lösungen</h4>
                      <p className="text-sm text-muted-foreground">{project.challenges}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-primary">Rolle der KI</h4>
                      <p className="text-sm text-muted-foreground">{project.ai_role}</p>
                    </div>

                    {project.demo_url && (
                      <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Code / Demo
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Access Control Project */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Portfolio-Zugriffskontrolle
                  </CardTitle>
                  <CardDescription>
                    Ein vollständiges Zugriffskontrollsystem mit Einladungslinks, Benutzerverwaltung und CMS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-primary">Technologien</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Next.js</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Supabase</Badge>
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">Tailwind CSS</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-primary">Herausforderungen & Lösungen</h4>
                    <p className="text-sm text-muted-foreground">
                      Implementierung eines sicheren Token-basierten Einladungssystems mit zeitlich begrenztem Zugriff.
                      Gelöst durch Supabase Row Level Security (RLS) und automatische Ablaufprüfungen.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-primary">Features</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Einladungslink-System mit One-Time-Tokens</li>
                      <li>30-Tage-Zugriffszeitraum mit Verlängerungsoption</li>
                      <li>Admin-Dashboard zur Verwaltung</li>
                      <li>Content-Management-System für Portfolio-Inhalte</li>
                      <li>Theme-Anpassungen (Farben, Schriftarten, Hintergrund)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Fähigkeiten & Technologien</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Tailwind CSS</Badge>
                    <Badge>HTML/CSS</Badge>
                    <Badge>JavaScript</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Node.js</Badge>
                    <Badge>Python</Badge>
                    <Badge>PostgreSQL</Badge>
                    <Badge>Supabase</Badge>
                    <Badge>REST APIs</Badge>
                    <Badge>SQL</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tools & DevOps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Git</Badge>
                    <Badge>Docker</Badge>
                    <Badge>Vercel</Badge>
                    <Badge>GitHub</Badge>
                    <Badge>VS Code</Badge>
                    <Badge>Copilot</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6">Kontakt</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Ich bin immer an neuen Projekten und Möglichkeiten interessiert. Kontaktieren Sie mich gerne, wenn
                    Sie zusammenarbeiten möchten oder einfach nur Kontakt aufnehmen möchten.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="flex-1 min-w-[200px] bg-transparent" asChild>
                      <a href={`mailto:${content?.email || "zsmolii@icloud.com"}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        E-Mail senden
                      </a>
                    </Button>
                    {content?.github_url && (
                      <Button variant="outline" className="flex-1 min-w-[200px] bg-transparent" asChild>
                        <a href={content.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {content?.linkedin_url && (
                      <Button variant="outline" className="flex-1 min-w-[200px] bg-transparent" asChild>
                        <a href={content.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="border-t py-8 mt-16">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© 2025 Portfolio. Alle Rechte vorbehalten.</p>
            <p className="mt-2">Zugriff gewährt für {user?.company_name}</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
