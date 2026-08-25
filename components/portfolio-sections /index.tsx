"use client"

interface AboutContent {
  name: string
  intro1: string
  intro2: string
  techStack: string[]
  github?: string
  linkedin?: string
  email?: string
}

interface ProjectItem {
  title: string
  icon: string
  description: string
  tech: string
  challenge: string | null
  aiRole: string
  link: string | null
  linkLabel: string
}

interface SkillItem {
  icon: string
  label: string
}

interface SkillCategory {
  title: string
  icon: string
  items: SkillItem[]
}

// ---------- Über mich ----------
export function AboutSection({ content }: { content: AboutContent }) {
  return (
    <section id="about" className="section">
      <div className="container about-content">
        <h1>Hallo, ich bin {content.name}</h1>
        <p>{content.intro1}</p>
        <p>{content.intro2}</p>

        <div className="tech-stack">
          {content.techStack?.map((tech) => (
            <span key={tech} className="badge">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- Projekte ----------
export function ProjectsSection({ items }: { items: ProjectItem[] }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <h2>Komplexe Projekte, Reale Lösungen</h2>
        <p style={{ textAlign: "center", marginBottom: "3rem" }}>
          Hier finden Sie einen Einblick in reale Anwendungen, die von Grund auf entwickelt wurden.
        </p>

        <div className="project-grid">
          {items.map((project) => (
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
  )
}

// ---------- Fähigkeiten ----------
export function SkillsSection({ categories, philosophy }: { categories: SkillCategory[]; philosophy: string }) {
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2>Technologischer Stack & Expertise</h2>

        {categories.map((category) => (
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
          <p>{philosophy}</p>
        </div>
      </div>
    </section>
  )
}

// ---------- Kontakt ----------
export function ContactSection({
  email,
  github,
  linkedin,
  resumeUrl,
  showForm,
}: {
  email: string
  github: string
  linkedin: string
  resumeUrl?: string | null
  showForm?: boolean
}) {
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2>
          <i className="fas fa-handshake"></i> Kontakt & Vernetzung
        </h2>
        <p style={{ textAlign: "center", marginBottom: "3rem" }}>
          Bereit für das nächste komplexe Projekt? Melden Sie sich direkt.
        </p>

        <div className="contact-grid">
          {showForm && (
            <div className="contact-form">
              <h3>Nachricht senden</h3>
              <form action={`mailto:${email}`} method="post" encType="text/plain">
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
                Oder direkt: <a href={`mailto:${email}`}>{email}</a>
              </p>
            </div>
          )}

          <div className="qr-code-section" style={{ textAlign: "center" }}>
            <h3>Vernetzung</h3>
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", fontSize: "2rem", marginTop: "1rem" }}>
              <a href={github} target="_blank" aria-label="GitHub" rel="noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href={linkedin} target="_blank" aria-label="LinkedIn" rel="noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={`mailto:${email}`} aria-label="E-Mail">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
            <p style={{ marginTop: "1.5rem" }}>
              {resumeUrl ? (
                <a href={resumeUrl} target="_blank" rel="noreferrer">
                  <i className="fas fa-file-pdf"></i> Lebenslauf herunterladen
                </a>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
