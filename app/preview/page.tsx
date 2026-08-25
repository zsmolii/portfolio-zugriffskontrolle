"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AboutSection, ProjectsSection, SkillsSection, ContactSection } from "@/components/portfolio-sections"

function PreviewPageInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [content, setContent] = useState<any>(null)
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

      setContent(data)
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
      </header>

      <main>
        {content?.about && <AboutSection content={content.about} />}
        {content?.projects && <ProjectsSection items={content.projects.items} />}
        {content?.skills && (
          <SkillsSection categories={content.skills.categories} philosophy={content.skills.philosophy} />
        )}
        {content?.contact && (
          <ContactSection email={content.contact.email} github={content.contact.github} linkedin={content.contact.linkedin} />
        )}

        {content?.contact && (
          <div style={{ textAlign: "center", padding: "0 0 3rem" }}>
            <Link href="/request-access">
              <Button>Für vollen Zugang registrieren (30 Tage)</Button>
            </Link>
          </div>
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
