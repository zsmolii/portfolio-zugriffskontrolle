"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function PortfolioSkillsPage() {
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
        </main>

        <footer className="footer">
          <div className="container">&copy; 2025 Portfolio | Gebaut mit reinem Code.</div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
