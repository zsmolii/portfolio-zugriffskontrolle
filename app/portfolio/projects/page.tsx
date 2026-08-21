"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ProjectItem {
  title: string
  icon: string
  description: string
  tech: string
  challenge: string | null
  aiRole: string
  link: string | null
  linkLabel: string
}

interface ProjectsContent {
  items: ProjectItem[]
}

export default function PortfolioProjectsPage() {
  const { isAdmin, logout } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState<ProjectsContent | null>(null)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  useEffect(() => {
    const loadContent = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("content")
        .eq("section", "projects")
        .maybeSingle()

      if (!error && data) {
        setContent(data.content as ProjectsContent)
      }
    }
    loadContent()
  }, [])

  return (
    <ProtectedRoute>
      <div className="portfolio-wrapper">
        <header className="header">
          <Link href="/portfolio" className="nav-title">
            Portfolio
          </Link>
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/portfolio">Über mich</Link>
              </li>
              <li className="nav-item">
                <Link href="/portfolio/projects" className="active">
                  Projekte
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/portfolio/skills">Fähigkeiten</Link>
              </li>
              <li className="nav-item">
                <Link href="/portfolio/contact">Kontakt</Link>
              </li>
              {isAdmin && (
                <li className="nav-item admin-nav">
                  <Link href="/admin">Dashboard</Link>
                </li>
              )}
            </ul>
          </nav>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </header>

        <main>
          <section id="projects" className="section">
            <div className="container">
              <h2>Komplexe Projekte, Reale Lösungen</h2>
              <p style={{ textAlign: "center", marginBottom: "3rem" }}>
                Hier finden Sie einen Einblick in reale Anwendungen, die von Grund auf entwickelt wurden.
              </p>

              {!content && <p>Wird geladen...</p>}

              <div className="project-grid">
                {content?.items.map((project) => (
                  <article className="card project-card" key={project.title}>
                    <h3>
                      <i className={`fas ${project.icon}`}></i> {project.title}
                    </h3>
                    <p>{project.description}</p>

                    <ul className="project-detail-list">
                      <li>
                        <strong>
                          <i className="fas fa-code"></i> Technologien
                        </strong>
                        {project.tech}
                      </li>
                      {project.challenge && (
                        <li>
                          <strong>
                            <i className="fas fa-exclamation-triangle"></i> Herausforderungen & Lösungen
                          </strong>
                          {project.challenge}
                        </li>
                      )}
                      <li>
                        <strong>
                          <i className="fas fa-brain"></i> Rolle der KI
                        </strong>
                        {project.aiRole}
                      </li>
                      <li>
                        {project.link ? (
                          <a href={project.link} target="_blank" rel="noreferrer">
                            <i className="fab fa-github"></i> {project.linkLabel}
                          </a>
                        ) : (
                          <span>
                            <i className="fas fa-lock"></i> {project.linkLabel}
                          </span>
                        )}
                      </li>
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container">&copy; 2025 Portfolio | Gebaut mit reinem Code.</div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}