"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Edit } from "lucide-react"

export default function PortfolioPage() {
  const { user, isAdmin } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)

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
        </header>

        <main>
          <section id="about" className="section">
            <div className="container about-content">
              {isEditMode && isAdmin && (
                <button className="edit-section-btn">
                  <Edit className="icon" /> Abschnitt bearbeiten
                </button>
              )}
              <h1>Hallo, ich bin [Ihr Name]</h1>
              <p>
                Ich bin ein autodidaktischer Entwickler mit Schwerpunkt auf **praxisorientierter Softwareentwicklung**.
                Ich verstehe Architektur, Logik und Systemdesign – und nutze KI-Tools gezielt, um Entwicklungsprozesse
                zu beschleunigen.
              </p>
              <p>
                Mein Fokus liegt auf funktionalen, sauberen und nachvollziehbaren Lösungen – egal ob Web-Apps,
                Datenverarbeitung oder Prozessautomatisierung.
              </p>

              <div className="tech-stack">
                <span className="badge">Python</span>
                <span className="badge">JavaScript</span>
                <span className="badge">Node.js</span>
                <span className="badge">React</span>
                <span className="badge">SQL</span>
                <span className="badge">Docker</span>
                <span className="badge">Git</span>
                <span className="badge">Copilot</span>
              </div>

              <div className="social-links">
                <a href="https://github.com/IhrUsername" target="_blank" aria-label="GitHub Profil" rel="noreferrer">
                  <i className="fab fa-github"></i>
                </a>
                <a
                  href="https://linkedin.com/in/IhrUsername"
                  target="_blank"
                  aria-label="LinkedIn Profil"
                  rel="noreferrer"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="mailto:ihre.adresse@email.com" aria-label="E-Mail senden">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>

          {/* Remove projects and skills sections */}
          {/* Remove contact section */}
        </main>

        <footer className="footer">
          <div className="container">&copy; 2025 Portfolio | Gebaut mit reinem Code.</div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
