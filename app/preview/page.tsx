"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PreviewContent {
  about?: {
    name: string
    intro1: string
    intro2: string
    techStack: string[]
  }
  projects?: {
    items: {
      title: string
      icon: string
      description: string
      tech: string
      challenge: string | null
      aiRole: string
      link: string | null
      linkLabel: string
    }[]
  }
  skills?: {
    categories: { title: string; icon: string; items: { icon: string; label: string }[] }[]
    philosophy: string
  }
  contact?: { email: string; github: string; linkedin: string }
}

function PreviewPageInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [content, setContent] = useState<PreviewContent | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const consume = async () => {
      if (!token) {
        setError("Kein gültiger Link.")
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error: rpcError } = await supabase.rpc("consume_preview_link", { p_token: token })

      if (rpcError) {
        if (rpcError.message.includes("already_used")) {
          setError(
            "Dieser Link wurde bereits verwendet. Aus Datenschutzgründen ist eine einmalige Ansicht pro Link vorgesehen.",
          )
        } else if (rpcError.message.includes("expired")) {
          setError("Dieser Link ist abgelaufen.")
        } else {
          setError("Dieser Link ist ungültig.")
        }
        setLoading(false)
        return
      }

      setContent(data as PreviewContent)
      setLoading(false)
    }
    consume()
  }, [token])

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p>Wird geladen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: "480px", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
        <h2>Kein Zugriff mehr</h2>
        <p style={{ margin: "1.5rem 0", color: "#888" }}>{error}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/request-access">
            <Button>Zugang anfragen</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Bereits registriert? Anmelden</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-wrapper">
      <div
        style={{
          background: "#1f3a5f",
          color: "white",
          padding: "0.85rem 1.5rem",
          textAlign: "center",
          fontSize: "0.9rem",
        }}
      >
        Dieser Link ist nur einmal gültig und schließt sich nach dieser Ansicht. Für dauerhaften Zugang (30 Tage)
        können Sie sich{" "}
        <Link href="/request-access" style={{ textDecoration: "underline", color: "white" }}>
          registrieren
        </Link>
        .
      </div>

      <header className="header">
        <div className="nav-title">Portfolio</div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">Über mich</li>
            <li className="nav-item">Projekte</li>
            <li className="nav-item">Fähigkeiten</li>
            <li className="nav-item">Kontakt</li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Über mich */}
        <section id="about" className="section">
          <div className="container about-content">
            {content?.about && (
              <>
                <h1>Hallo, ich bin {content.about.name}</h1>
                <p>{content.about.intro1}</p>
                <p>{content.about.intro2}</p>

                <div className="tech-stack">
                  {content.about.techStack?.map((tech) => (
                    <span key={tech} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Projekte */}
        {content?.projects && (
          <section id="projects" className="section">
            <div className="container">
              <h2>Komplexe Projekte, Reale Lösungen</h2>
              <p style={{ textAlign: "center", marginBottom: "3rem" }}>
                Hier finden Sie einen Einblick in reale Anwendungen, die von Grund auf entwickelt wurden.
              </p>

              <div className="project-grid">
                {content.projects.items.map((project) => (
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
        )}

        {/* Fähigkeiten */}
        {content?.skills && (
          <section id="skills" className="section">
            <div className="container">
              <h2>Technologischer Stack & Expertise</h2>

              {content.skills.categories.map((category) => (
                <div className="skill-category" key={category.title}>
                  <h3>
                    <i className={`fas ${category.icon}`}></i> {category.title}
                  </h3>
                  <div className="skills-grid">
                    {category.items.map((item) => (
                      <div className="skill-item" key={item.label}>
                        <i className={`fas ${item.icon}`}></i>
                        <p>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <h3 style={{ marginTop: "2rem" }}>
                <i className="fas fa-graduation-cap"></i> Lernansatz & Philosophie
              </h3>
              <div className="card" style={{ borderLeft: "4px solid orange", padding: "1.5rem" }}>
                <p>{content.skills.philosophy}</p>
              </div>
            </div>
          </section>
        )}

        {/* Kontakt */}
        {content?.contact && (
          <section id="contact" className="section">
            <div className="container" style={{ textAlign: "center" }}>
              <h2>
                <i className="fas fa-handshake"></i> Kontakt & Vernetzung
              </h2>

              <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", fontSize: "2rem", marginTop: "1.5rem" }}>
                <a href={content.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href={content.contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href={`mailto:${content.contact.email}`} aria-label="E-Mail">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>

              <div style={{ marginTop: "2.5rem" }}>
                <Link href="/request-access">
                  <Button>Für vollen Zugang registrieren (30 Tage)</Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container">&copy; 2025 Portfolio | Gebaut mit reinem Code.</div>
      </footer>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center" }}>Wird geladen...</div>}>
      <PreviewPageInner />
    </Suspense>
  )
}
