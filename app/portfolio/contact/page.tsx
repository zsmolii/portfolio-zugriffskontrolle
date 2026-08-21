"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ContactContent {
  email: string
  github: string
  linkedin: string
}

export default function PortfolioContactPage() {
  const { isAdmin, logout } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState<ContactContent | null>(null)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)

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
        .eq("section", "contact")
        .maybeSingle()

      if (!error && data) {
        setContent(data.content as ContactContent)
      }

      // Signierter, zeitlich begrenzter Link zum Lebenslauf – nur für eingeloggte Nutzer erzeugbar
      const { data: signedUrlData } = await supabase.storage
        .from("private-documents")
        .createSignedUrl("lebenslauf-dennis-smolinski.pdf", 3600)

      if (signedUrlData) {
        setResumeUrl(signedUrlData.signedUrl)
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
                <Link href="/portfolio/projects">Projekte</Link>
              </li>
              <li className="nav-item">
                <Link href="/portfolio/skills">Fähigkeiten</Link>
              </li>
              <li className="nav-item">
                <Link href="/portfolio/contact" className="active">
                  Kontakt
                </Link>
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
          <section id="contact" className="section">
            <div className="container">
              <h2>
                <i className="fas fa-handshake"></i> Kontakt & Vernetzung
              </h2>
              <p style={{ textAlign: "center", marginBottom: "3rem" }}>
                Bereit für das nächste komplexe Projekt? Melden Sie sich direkt.
              </p>

              {content && (
                <div className="contact-grid">
                  <div className="contact-form">
                    <h3>Nachricht senden</h3>
                    <form action={`mailto:${content.email}`} method="post" encType="text/plain">
                      <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="Name" required />
                      </div>
                      <div>
                        <label htmlFor="email">E-Mail:</label>
                        <input type="email" id="email" name="E-Mail" required />
                      </div>
                      <div>
                        <label htmlFor="message">Nachricht:</label>
                        <textarea id="message" name="Nachricht" rows={5} required></textarea>
                      </div>
                      <button type="submit">Nachricht absenden</button>
                    </form>
                    <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                      Oder direkt: <a href={`mailto:${content.email}`}>{content.email}</a>
                    </p>
                  </div>

                  <div className="qr-code-section">
                    <h3>Vernetzung</h3>
                    <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", fontSize: "2rem" }}>
                      <a href={content.github} target="_blank" aria-label="GitHub" rel="noreferrer">
                        <i className="fab fa-github"></i>
                      </a>
                      <a href={content.linkedin} target="_blank" aria-label="LinkedIn" rel="noreferrer">
                        <i className="fab fa-linkedin"></i>
                      </a>
                      <a href={`mailto:${content.email}`} aria-label="E-Mail">
                        <i className="fas fa-envelope"></i>
                      </a>
                    </div>
                    <p style={{ marginTop: "1.5rem" }}>
                      {resumeUrl ? (
                        <a href={resumeUrl} target="_blank" rel="noreferrer">
                          <i className="fas fa-file-pdf"></i> Lebenslauf herunterladen
                        </a>
                      ) : (
                        <span style={{ opacity: 0.6 }}>
                          <i className="fas fa-file-pdf"></i> Lebenslauf wird geladen...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
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