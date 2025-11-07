"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function PortfolioContactPage() {
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
