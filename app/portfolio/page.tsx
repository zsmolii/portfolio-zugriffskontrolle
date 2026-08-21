"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AboutContent {
  name: string
  intro1: string
  intro2: string
  techStack: string[]
  github: string
  linkedin: string
  email: string
}

export default function PortfolioPage() {
  const { isAdmin, logout } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)

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
        .eq("section", "about")
        .maybeSingle()

      if (!error && data) {
        setContent(data.content as AboutContent)
      }
      setLoading(false)
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
                <Link href="/portfolio" className="active">
                  Über mich
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/portfolio/projects">Projekte</Link>
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
          <section id="about" className="section">
            <div className="container about-content">
              {loading && <p>Wird geladen...</p>}
              {!loading && !content && <p>Inhalt konnte nicht geladen werden.</p>}
              {content && (
                <>
                  <h1>Hallo, ich bin {content.name}</h1>
                  <p>{content.intro1}</p>
                  <p>{content.intro2}</p>

                  <div className="tech-stack">
                    {content.techStack.map((tech) => (
                      <span key={tech} className="badge">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="social-links">
                    <a href={content.github} target="_blank" aria-label="GitHub Profil" rel="noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href={content.linkedin} target="_blank" aria-label="LinkedIn Profil" rel="noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href={`mailto:${content.email}`} aria-label="E-Mail senden">
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>

                  <p style={{ marginTop: "1.5rem" }}>
                    <Link href="/portfolio/contact">
                      <i className="fas fa-file-pdf"></i> Lebenslauf & Kontakt
                    </Link>
                  </p>
                </>
              )}
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
