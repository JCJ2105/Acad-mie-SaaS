'use client'

import { useState } from 'react'
import {
  Bell,
  Bot,
  BookOpen,
  ChevronRight,
  CircleHelp,
  Compass,
  Gauge,
  LayoutGrid,
  MessageCircle,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react'

const navigation = [
  { label: 'Modules', icon: BookOpen, items: ['Fondamentaux', 'Construire avec l’IA', 'Publier son app'] },
  { label: 'Mes Agents', icon: Bot, items: ['Mon espace de travail', 'Nouveaux agents'] },
  { label: 'Communauté', icon: Users, items: ['Discussions', 'Projets des membres'] },
]

const stats = [
  { label: 'Progrès global', value: '68%', icon: Gauge, accent: 'stat-violet' },
  { label: 'Modules en cours', value: '3', icon: BookOpen, accent: 'stat-blue' },
  { label: 'Agents actifs', value: '2', icon: Bot, accent: 'stat-teal' },
  { label: 'Notifications', value: '5', icon: Bell, accent: 'stat-amber' },
]

export type Course = {
  tag: string
  title: string
  meta: string
  progress: number
}

export function Dashboard({ courses }: { courses: Course[] }) {
  const [activeSection, setActiveSection] = useState('Modules')
  const [started, setStarted] = useState(false)

  return (
    <main className="dashboard-shell">
      <div className="grid-backdrop" aria-hidden="true" />

      <aside className="sidebar" aria-label="Navigation principale">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><Sparkles size={18} strokeWidth={2.5} /></div>
          <span>Académie <span className="brand-muted">SaaS</span></span>
        </div>

        <nav className="sidebar-nav">
          <p className="eyebrow">Espace d’apprentissage</p>
          {navigation.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.label
            return (
              <div className="nav-section" key={section.label}>
                <button className={`nav-heading ${isActive ? 'is-active' : ''}`} onClick={() => setActiveSection(section.label)} aria-expanded={isActive}>
                  <span className="nav-heading-label"><Icon size={18} />{section.label}</span>
                  <ChevronRight size={15} className={isActive ? 'rotate-90' : ''} />
                </button>
                {isActive && (
                  <div className="nav-subitems">
                    {section.items.map((item, index) => <button className={`nav-subitem ${index === 0 ? 'current' : ''}`} key={item}>{item}</button>)}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="help-link"><CircleHelp size={17} />Centre d’aide</button>
          <div className="profile-card">
            <div className="avatar">AM</div>
            <div><strong>Alex Martin</strong><span>Membre depuis 2024</span></div>
            <MoreDots />
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><LayoutGrid size={16} /> Tableau de bord <ChevronRight size={14} /> <span>Accueil</span></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Communauté"><MessageCircle size={18} /></button><button className="avatar small" aria-label="Profil">AM</button></div>
        </header>

        <div className="content-wrap">
          <div className="welcome-chip"><span className="status-dot" /> Votre parcours commence ici</div>
          <h1>Apprenez à bâtir<br /><span>vos logiciels avec l’IA.</span></h1>
          <p className="intro">Une méthode claire, des outils puissants et une communauté<br className="desktop-break" /> pour transformer vos idées en produits qui comptent.</p>
          <button className="primary-cta" onClick={() => setStarted(true)}>{started ? 'Votre espace est prêt' : 'Démarrer ma première application'} <span className="cta-arrow"><Plus size={19} /></span></button>

          <div className="stats-row" role="list" aria-label="Statistiques de votre parcours">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <button className={`stat-card ${stat.accent}`} key={stat.label} role="listitem">
                  <span className="stat-icon"><Icon size={16} /></span>
                  <span className="stat-copy">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="journey-card">
            <div className="journey-icon"><Compass size={22} /></div>
            <div className="journey-copy"><span className="card-kicker">Votre prochaine étape</span><strong>{started ? 'Bienvenue dans votre atelier' : 'Découvrez les fondamentaux'}</strong><span>Maîtrisez les bases pour avancer avec confiance.</span></div>
            <button className="round-arrow" aria-label="Voir la prochaine étape"><ChevronRight size={18} /></button>
          </div>

          <section className="courses-section" aria-labelledby="courses-heading">
            <div className="courses-heading-row">
              <h2 id="courses-heading">Derniers cours</h2>
              <button className="see-all">Voir tout <ChevronRight size={14} /></button>
            </div>
            <div className="courses-grid">
              {courses.length === 0 ? (
                <p className="courses-empty">Aucun module trouvé dans la base de données.</p>
              ) : (
                courses.map((course) => (
                  <article className="course-card" key={course.title}>
                    <span className="course-tag">{course.tag}</span>
                    <h3>{course.title}</h3>
                    <p>{course.meta}</p>
                    <div className="course-gauge" role="progressbar" aria-valuenow={course.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progression : ${course.progress}%`}>
                      <div className="course-gauge-fill" style={{ width: `${course.progress}%` }} />
                    </div>
                    <div className="course-gauge-label"><span>{course.progress}% terminé</span></div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
        <footer className="footer-note">Apprendre. Construire. Lancer. <span>—</span> À votre rythme.</footer>
      </section>
    </main>
  )
}

function MoreDots() {
  return <span className="more-dots" aria-hidden="true"><i /><i /><i /></span>
}
