"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function PortfolioProjectsPage() {
  const { isAdmin } = useAuth()

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
        </header>

        <main>
          <section id="projects" className="section">
            <div className="container">
              <h2>Komplexe Projekte, Reale Lösungen</h2>
              <p style={{ marginBottom: "2rem" }}>
                Hier finden Sie einen Einblick in reale Anwendungen, die von Grund auf entwickelt wurden.
              </p>

              <div className="project-grid">
                <article className="card project-card">
                  <h3>
                    <i className="fas fa-warehouse"></i> Materiallager-System mit Lieferscheinverwaltung
                  </h3>
                  <p>
                    Ein webbasiertes System zur Verwaltung von Materialbeständen. Lieferscheine werden gescannt,
                    Aufträge automatisch zugeordnet und Materialbewegungen dokumentiert.
                  </p>

                  <ul className="project-detail-list">
                    <li>
                      <strong>
                        <i className="fas fa-code"></i> Technologien
                      </strong>
                      HTML, CSS, JavaScript, Node.js, OCR-API, KI-Unterstützung bei Codegenerierung
                    </li>
                    <li>
                      <strong>
                        <i className="fas fa-exclamation-triangle"></i> Herausforderungen & Lösungen
                      </strong>
                      Das OCR-Parsing war unzuverlässig – mithilfe eines **KI-basierten Regex-Analyzers** konnte ich die
                      Texterkennung stabilisieren und die Genauigkeit auf 98% erhöhen.
                    </li>
                    <li>
                      <strong>
                        <i className="fas fa-brain"></i> Rolle der KI
                      </strong>
                      Ich nutzte KI für Code-Vorschläge, Refactoring und API-Dokumentation, aber alle
                      **Architekturentscheidungen traf ich selbst** und führte umfassende manuelle Reviews durch.
                    </li>
                    <li>
                      <a href="https://github.com/IhrProjektRepo" target="_blank" rel="noreferrer">
                        <i className="fab fa-github"></i> ➡️ View Code / Demo
                      </a>
                    </li>
                  </ul>
                </article>

                <article className="card project-card">
                  <h3>
                    <i className="fas fa-chart-line"></i> Echtzeit-Datenvisualisierungs-Tool
                  </h3>
                  <p>
                    Ein Python-basiertes Backend zur Verarbeitung von Sensordaten und eine React-Oberfläche zur
                    Visualisierung von Zeitreihen-Metriken.
                  </p>
                  <ul className="project-detail-list">
                    <li>
                      <strong>
                        <i className="fas fa-code"></i> Technologien
                      </strong>
                      Python (FastAPI), Pandas, React, Chart.js, Docker
                    </li>
                    <li>
                      <strong>
                        <i className="fas fa-exclamation-triangle"></i> Herausforderungen & Lösungen
                      </strong>
                      Hohe Latenz bei der Datenbankabfrage – gelöst durch Implementierung eines Redis-Caches und
                      Optimierung der SQL-Queries.
                    </li>
                    <li>
                      <strong>
                        <i className="fas fa-brain"></i> Rolle der KI
                      </strong>
                      KI unterstützte bei der Erstellung von Dockerfiles und der Fehlersuche in der
                      Python-Datenpipeline.
                    </li>
                    <li>
                      <a href="#" target="_blank" rel="noreferrer">
                        <i className="fab fa-github"></i> ➡️ View Code / Demo
                      </a>
                    </li>
                  </ul>
                </article>

                {/* Additional project cards can be added here */}
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
