"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface SkillItem {
  icon: string
  label: string
}

interface SkillCategory {
  title: string
  icon: string
  items: SkillItem[]
}

interface SkillsContent {
  categories: SkillCategory[]
  philosophy: string
}

export default function PortfolioSkillsPage() {
  const { isAdmin } = useAuth()
  const [content, setContent] = useState<SkillsContent | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("content")
        .eq("section", "skills")
        .maybeSingle()

      if (!error && data) {
        setContent(data.content as SkillsContent)
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
        </header>

        <main>
          <section id="skills" className="section">
            <div className="container">
              <h2>Technologischer Stack & Expertise</h2>

              {!content && <p>Wird geladen...</p>}

              {content?.categories.map((category) => (
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

              {content && (
                <>
                  <h3 style={{ marginTop: "2rem" }}>
                    <i className="fas fa-graduation-cap"></i> Lernansatz & Philosophie
                  </h3>
                  <div className="card" style={{ borderLeft: "4px solid orange", padding: "1.5rem" }}>
                    <p>{content.philosophy}</p>
                  </div>
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
