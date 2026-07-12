import { lazy, Suspense } from 'react'
import TiltCard from './components/TiltCard.jsx'
import Reveal from './components/Reveal.jsx'

// three.js è pesante: la scena si carica in lazy per non bloccare il primo render
const Scene3D = lazy(() => import('./components/Scene3D.jsx'))

const stack = [
  'AWS',
  'EKS',
  'Kubernetes',
  'ArgoCD',
  'GitOps',
  'Aurora',
  'CloudFront',
  'Helm',
  'GitHub Actions',
  'FluxCD',
  'AKS',
  'VMware',
  'Ansible',
  'Docker',
  'Linux',
]

const experiences = [
  {
    period: 'Oggi',
    role: 'DevOps Engineer',
    company: '4Science',
    companyUrl: 'https://4science.com',
    companyNote: 'Cloud AWS, Kubernetes e GitOps per progetti istituzionali',
    highlights: [
      'Progetto e gestisco infrastrutture su AWS: cluster EKS, database Aurora, CloudFront come CDN, firewall e networking.',
      'Gestisco release e ambienti con ArgoCD: lo stato dell’infrastruttura è versionato in Git, coerente e ricostruibile.',
      'Automatizzo build e release con GitHub Actions e workflow riusabili.',
    ],
    tags: ['AWS', 'EKS', 'ArgoCD', 'Aurora', 'CloudFront', 'GitHub Actions'],
  },
  {
    period: 'In precedenza',
    role: 'DevOps Engineer',
    companyNote: 'Piattaforme Kubernetes in cloud Azure e on-premise',
    highlights: [
      'Ho progettato il sistema di CI/CD GitOps del progetto istituzionale del Gioco del Lotto italiano.',
      'Gestione di cluster Kubernetes su AKS e on-premise su VMware.',
      'Deployment GitOps con FluxCD e Helm: ambienti versionati, coerenti e ricostruibili.',
      'Automazione di provisioning e configurazione con Ansible.',
    ],
    tags: ['AKS', 'Kubernetes', 'VMware', 'FluxCD', 'Helm', 'Ansible'],
  },
]

const areas = [
  {
    title: 'Cloud AWS',
    description:
      'Infrastrutture su AWS progettate per essere affidabili e ricostruibili: EKS, Aurora, CloudFront e networking sicuro.',
  },
  {
    title: 'GitOps & ArgoCD',
    description:
      'Lo stato dell’infrastruttura vive in Git: deployment dichiarativi con ArgoCD, versionati e revisionabili.',
  },
  {
    title: 'Automazione CI/CD',
    description:
      'Pipeline GitHub Actions e workflow riusabili che rendono la delivery prevedibile e noiosa. Nel senso buono.',
  },
]

const principles = ['Semplicità', 'Standard', 'Affidabilità', 'Automazione']

export default function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          Andrea Di Paola
        </div>

        <nav className="nav">
          <a href="#esperienza">Esperienza</a>
          <a href="#stack">Stack</a>
          <a href="#focus">Focus</a>
          <a href="#contatti">Contatti</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>

          <div className="hero-copy">
            <Reveal>
              <div className="status-pill">
                <span className="status-dot" />
                DevOps Engineer @ 4Science
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h1>
                Infrastrutture pulite.
                <br />
                Automazione solida.
                <br />
                <span className="gradient-text">Delivery affidabile.</span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="hero-text">
                Costruisco e gestisco piattaforme cloud su AWS e Kubernetes:
                cluster EKS, delivery GitOps con ArgoCD e pipeline che portano
                il codice in produzione senza sorprese.
              </p>
            </Reveal>

            <Reveal delay={270}>
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
            </Reveal>
          </div>

          <a className="scroll-cue" href="#esperienza" aria-label="Scorri alla sezione esperienza">
            <span />
          </a>
        </section>

        <section id="esperienza" className="section-block">
          <Reveal>
            <div className="section-label">Esperienza</div>
            <h2 className="section-title">Dove lavoro, cosa faccio</h2>
          </Reveal>

          <div className="timeline">
            {experiences.map((exp) => (
              <Reveal key={exp.period} delay={120}>
                <article className="timeline-item">
                  <div className="timeline-meta">
                    <span className="timeline-period">{exp.period}</span>
                  </div>

                  <TiltCard className="timeline-card" max={4}>
                    <div className="timeline-header">
                      <h3>{exp.role}</h3>
                      {exp.company && (
                        <a
                          className="timeline-company"
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {exp.company} ↗
                        </a>
                      )}
                    </div>

                    <p className="timeline-note">{exp.companyNote}</p>

                    <ul className="timeline-highlights">
                      {exp.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <div className="chips chips-small">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TiltCard>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="stack" className="section-block">
          <Reveal>
            <div className="section-label">Stack</div>
            <h2 className="section-title">Strumenti di ogni giorno</h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="chips">
              {stack.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="focus" className="section-block">
          <Reveal>
            <div className="section-label">Focus</div>
            <h2 className="section-title">Ambiti su cui lavoro</h2>
          </Reveal>

          <div className="areas-grid">
            {areas.map((area, index) => (
              <Reveal key={area.title} delay={index * 110}>
                <TiltCard className="area-card">
                  <div className="area-top">
                    <h3>{area.title}</h3>
                    <span className="arrow-circle">↗</span>
                  </div>
                  <p>{area.description}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <Reveal>
            <div className="section-label">Principi</div>
          </Reveal>

          <div className="principles">
            {principles.map((item, index) => (
              <Reveal key={item} delay={index * 80}>
                <div className="principle-card">{item}</div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contatti" className="section-block">
          <Reveal>
            <div className="contact-card">
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
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        © Andrea Di Paola — costruito con React, Vite e Three.js
      </footer>
    </div>
  )
}
