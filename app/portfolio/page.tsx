"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { createBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Edit, LayoutDashboard } from "lucide-react"

export default function PortfolioPage() {
  const { user, isAdmin } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)
  const supabase = createBrowserClient()

  return (
    <ProtectedRoute>
      <div className="portfolio-wrapper">
        {isAdmin && (
          <div className="admin-toolbar">
            <Link href="/admin" className="admin-btn">
              <LayoutDashboard className="icon" />
              Zurück zum Dashboard
            </Link>
            <button onClick={() => setIsEditMode(!isEditMode)} className={`admin-btn ${isEditMode ? "active" : ""}`}>
              <Edit className="icon" />
              {isEditMode ? "Bearbeitungsmodus beenden" : "Bearbeiten"}
            </button>
          </div>
        )}

        <header className="header">
          <a href="#about" className="nav-title">
            Portfolio
          </a>
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#about">Über mich</a>
              </li>
              <li className="nav-item">
                <a href="#projects">Projekte</a>
              </li>
              <li className="nav-item">
                <a href="#skills">Fähigkeiten</a>
              </li>
              <li className="nav-item">
                <a href="#contact">Kontakt</a>
              </li>
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

          <section id="projects" className="section">
            <div className="container">
              {isEditMode && isAdmin && (
                <button className="edit-section-btn">
                  <Edit className="icon" /> Projekte bearbeiten
                </button>
              )}
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
              </div>
            </div>
          </section>

          <section id="skills" className="section">
            <div className="container">
              {isEditMode && isAdmin && (
                <button className="edit-section-btn">
                  <Edit className="icon" /> Fähigkeiten bearbeiten
                </button>
              )}
              <h2>Technologischer Stack & Expertise</h2>

              <div className="skill-category">
                <h3>
                  <i className="fas fa-laptop-code"></i> Frontend-Entwicklung
                </h3>
                <div className="skills-grid">
                  <div className="skill-item">
                    <i className="fab fa-html5"></i>
                    <p>HTML5</p>
                  </div>
                  <div className="skill-item">
                    <i className="fab fa-css3-alt"></i>
                    <p>CSS3 / Flexbox / Grid</p>
                  </div>
                  <div className="skill-item">
                    <i className="fab fa-js"></i>
                    <p>JavaScript (ES6+)</p>
                  </div>
                  <div className="skill-item">
                    <i className="fab fa-react"></i>
                    <p>React</p>
                  </div>
                </div>
              </div>

              <div className="skill-category">
                <h3>
                  <i className="fas fa-server"></i> Backend & Data
                </h3>
                <div className="skills-grid">
                  <div className="skill-item">
                    <i className="fab fa-node-js"></i>
                    <p>Node.js</p>
                  </div>
                  <div className="skill-item">
                    <i className="fas fa-atom"></i>
                    <p>Express.js</p>
                  </div>
                  <div className="skill-item">
                    <i className="fab fa-python"></i>
                    <p>Python</p>
                  </div>
                  <div className="skill-item">
                    <i className="fas fa-database"></i>
                    <p>SQL (PostgreSQL/MySQL)</p>
                  </div>
                </div>
              </div>

              <div className="skill-category">
                <h3>
                  <i className="fas fa-tools"></i> Tools & Infrastruktur
                </h3>
                <div className="skills-grid">
                  <div className="skill-item">
                    <i className="fab fa-git-alt"></i>
                    <p>Git / GitHub</p>
                  </div>
                  <div className="skill-item">
                    <i className="fas fa-terminal"></i>
                    <p>VS Code</p>
                  </div>
                  <div className="skill-item">
                    <i className="fab fa-docker"></i>
                    <p>Docker</p>
                  </div>
                  <div className="skill-item">
                    <i className="fas fa-plug"></i>
                    <p>REST APIs / Postman</p>
                  </div>
                </div>
              </div>

              <div className="skill-category">
                <h3>
                  <i className="fas fa-robot"></i> KI-Werkzeuge & Philosophie
                </h3>
                <div className="skills-grid">
                  <div className="skill-item">
                    <i className="fas fa-comments"></i>
                    <p>ChatGPT / GPT-4</p>
                  </div>
                  <div className="skill-item">
                    <i className="fas fa-hand-holding-box"></i>
                    <p>GitHub Copilot</p>
                  </div>
                  <div className="skill-item">
                    <i className="fas fa-lightbulb"></i>
                    <p>Cursor / Andere KI-IDEs</p>
                  </div>
                </div>

                <div className="card philosophy-card" style={{ marginTop: "2rem" }}>
                  <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}>
                    Ich sehe KI nicht als Ersatz, sondern als Werkzeug, das sauberen, nachvollziehbaren Code
                    beschleunigt.
                  </p>
                </div>
              </div>

              <h2 style={{ marginTop: "4rem" }}>
                <i className="fas fa-graduation-cap"></i> Lernansatz & Philosophie
              </h2>
              <article className="card philosophy-card">
                <p>
                  Ich arbeite nach dem Prinzip **&quot;Verstehen vor Automatisieren&quot;**. Ich nutze KI-Tools gezielt,
                  um Routinearbeit zu verkürzen – nicht um Verantwortung abzugeben.
                </p>
                <p style={{ marginTop: "0.8rem" }}>
                  Mein Ziel ist es, Systeme zu entwickeln, die **nachvollziehbar, skalierbar und logisch konsistent**
                  sind. Die Architektur bleibt dabei stets in meiner Hand.
                </p>
              </article>
            </div>
          </section>

          <section id="contact" className="section">
            <div className="container">
              {isEditMode && isAdmin && (
                <button className="edit-section-btn">
                  <Edit className="icon" /> Kontakt bearbeiten
                </button>
              )}
              <h2>
                <i className="fas fa-handshake"></i> Kontakt & Vernetzung
              </h2>
              <p style={{ textAlign: "center", marginBottom: "3rem" }}>
                Bereit für das nächste komplexe Projekt? Melden Sie sich direkt.
              </p>

              <div className="contact-grid">
                <div className="contact-form">
                  <h3>Nachricht senden</h3>
                  <form action="mailto:ihre.adresse@email.com" method="post" encType="text/plain">
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
                    Oder direkt: <a href="mailto:ihre.adresse@email.com">ihre.adresse@email.com</a>
                  </p>
                </div>

                <div className="qr-code-section">
                  <h3>Vernetzung</h3>
                  <p>Scannen Sie, um mein LinkedIn-Profil zu speichern.</p>
                  <div className="qr-code-placeholder">
                    [QR-Code Platzhalter]
                    <br />
                    LinkedIn
                  </div>
                  <p style={{ marginTop: "1rem" }}>
                    <a href="https://github.com/IhrUsername" target="_blank" aria-label="GitHub" rel="noreferrer">
                      <i className="fab fa-github"></i> GitHub Profil
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://linkedin.com/in/IhrUsername"
                      target="_blank"
                      aria-label="LinkedIn"
                      rel="noreferrer"
                    >
                      <i className="fab fa-linkedin"></i> LinkedIn Profil
                    </a>
                  </p>
                </div>
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
