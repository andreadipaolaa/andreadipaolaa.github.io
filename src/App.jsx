const stack = [
  'Kubernetes',
  'GitOps',
  'FluxCD',
  'Helm',
  'GitHub Actions',
  'Ansible',
  'AKS',
  'Docker',
  'Linux',
  'CI/CD',
]

const areas = [
  {
    title: 'Piattaforme Kubernetes',
    description: 'Release, standardizzazione, affidabilità.',
  },
  {
    title: 'Automazione CI/CD',
    description: 'Workflow riusabili e delivery più chiara.',
  },
  {
    title: 'GitOps & FluxCD',
    description: 'Ambienti coerenti e versionati in Git.',
  },
]

const principles = ['Semplicità', 'Standard', 'Affidabilità', 'Automazione']

export default function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">Andrea Di Paola</div>

        <nav className="nav">
          <a href="#profilo">Profilo</a>
          <a href="#stack">Stack</a>
          <a href="#focus">Focus</a>
          <a href="#contatti">Contatti</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">DevOps Engineer</div>

            <h1>
              Infrastrutture pulite.
              <br />
              Automazione solida.
              <br />
              Delivery affidabile.
            </h1>

            <p className="hero-text">
              Kubernetes, GitOps, CI/CD e platform workflows.
            </p>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href="https://github.com/andreadipaolaa"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>

              <a
                className="button button-secondary"
                href="https://www.linkedin.com/in/andrea-di-paola-606704192/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <aside id="profilo" className="card glass-card profile-card">
            <div className="section-label">Profilo</div>

            <div className="profile-name">Andrea</div>
            <div className="profile-role">DevOps Engineer</div>

            <div className="profile-grid">
              <div className="soft-box">
                <div className="soft-label">Focus</div>
                <div className="soft-value">Kubernetes · GitOps · CI/CD</div>
              </div>

              <div className="soft-box">
                <div className="soft-label">Approccio</div>
                <div className="soft-value">Semplicità · Standard · Affidabilità</div>
              </div>
            </div>
          </aside>
        </section>

        <section id="stack" className="section-block">
          <div className="section-label">Stack</div>

          <div className="chips">
            {stack.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-label">Principi</div>

          <div className="principles">
            {principles.map((item) => (
              <div key={item} className="principle-card">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="focus" className="section-block">
          <div className="section-label">Focus</div>
          <h2 className="section-title">Ambiti su cui lavoro</h2>

          <div className="areas-grid">
            {areas.map((area) => (
              <a
                key={area.title}
                className="area-card"
                href="https://github.com/andreadipaolaa"
                target="_blank"
                rel="noreferrer"
              >
                <div className="area-top">
                  <h3>{area.title}</h3>
                  <span className="arrow-circle">↗</span>
                </div>
                <p>{area.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="contatti" className="section-block">
          <div className="card contact-card">
            <div>
              <div className="section-label">Contatti</div>
              <h2 className="section-title">
                Restiamo in contatto.
                <br />
                Parliamone.
              </h2>
            </div>

            <div className="contact-actions">
              <a
                className="button button-secondary"
                href="https://github.com/andreadipaolaa"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>

              <a
                className="button button-secondary"
                href="https://www.linkedin.com/in/andrea-di-paola-606704192/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

              <a
                className="button button-primary"
                href="mailto:andrea.dipaola@outlook.com"
              >
                Email
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">© Andrea Di Paola</footer>
    </div>
  )
}
