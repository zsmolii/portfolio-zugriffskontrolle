"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SkillsSection } from "@/components/portfolio-sections"

export default function PortfolioSkillsPage() {
  const { isAdmin, logout } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState<any>(null)

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
        .eq("section", "skills")
        .maybeSingle()

      if (!error && data) setContent(data.content)
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
                <Link href="/portfolio/skills" className="active">
                  Fähigkeiten
                </Link>
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
          {!content && (
            <div className="container" style={{ padding: "3rem", textAlign: "center" }}>
              Wird geladen...
            </div>
          )}
          {content && <SkillsSection categories={content.categories} philosophy={content.philosophy} />}
        </main>

        <footer className="footer">
          <div className="container">&copy; 2025 Portfolio | Gebaut mit reinem Code.</div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
