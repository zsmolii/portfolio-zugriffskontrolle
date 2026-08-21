"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PreviewContent {
  about?: { name: string; intro1: string; intro2: string; techStack: string[] }
  projects?: { items: any[] }
  skills?: { categories: any[]; philosophy: string }
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
          padding: "1rem 1.5rem",
          textAlign: "center",
          fontSize: "0.95rem",
        }}
      >
        Dieser Link ist nur einmal gültig. Sobald Sie diese Seite schließen, haben Sie aus Datenschutz- und
        Sicherheitsgründen keinen erneuten Zugriff. Für dauerhaften Zugang (30 Tage) können Sie sich{" "}
        <Link href="/request-access" style={{ textDecoration: "underline", color: "white" }}>
          registrieren
        </Link>
        .
      </div>

      <header className="header">
        <div className="nav-title">Portfolio</div>
      </header>

      <main>
        <section className="section">
          <div className="container about-content">
            {content?.about && (
              <>
                <h1>Hallo, ich bin {content.about.name}</h1>
                <p>{content.about.intro1}</p>
                <p>{content.about.intro2}</p>
                <div className="tech-stack">
                  {content.about.techStack?.map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {content?.projects && (
          <section className="section">
            <div className="container">
              <h2>Projekte</h2>
              <div className="project-grid">
                {content.projects.items.map((p: any) => (
                  <article className="card project-card" key={p.title}>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {content?.contact && (
          <section className="section">
            <div className="container" style={{ textAlign: "center" }}>
              <h2>Kontakt</h2>
              <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", fontSize: "2rem" }}>
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
              <div style={{ marginTop: "2rem" }}>
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