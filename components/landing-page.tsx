import Link from "next/link"
import { ArrowRight, Check, Database, GraduationCap, TrendingUp, Workflow } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"

const PILLARS = [
  {
    icon: Database,
    title: "Architecturez",
    description: "Structurez vos données comme un pro.",
  },
  {
    icon: Workflow,
    title: "Automatisez",
    description: "Maîtrisez les agents IA et les workflows.",
  },
  {
    icon: TrendingUp,
    title: "Convertissez",
    description: "Créez un onboarding qui retient les utilisateurs.",
  },
] as const

const PRICING_FEATURES = [
  "Accès complet à l'Académie SaaS",
  "Prompts d'architecture prêts à l'emploi",
  "Modules sur les agents IA et l'automatisation",
  "Méthodes d'onboarding et de rétention",
] as const

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <MethodSection />
        <PricingSection />
      </main>
      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-violet-600/15 text-violet-400">
            <GraduationCap className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            Académie SaaS
          </span>
        </Link>

        <MagneticButton
          href="/auth"
          variant="outline"
          className="h-9 px-4 text-sm"
        >
          Se connecter
        </MagneticButton>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="px-6 py-28 sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 px-3.5 py-1.5 text-xs text-zinc-400">
          <span className="size-1.5 rounded-full bg-violet-500 shadow-[0_0_0_4px_rgba(139,92,246,0.15)]" />
          Académie SaaS
        </div>

        <h1 className="mt-8 text-balance bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Apprenez à bâtir vos logiciels avec l&apos;IA. Sans coder.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
          Des bases de données haute performance à la rétention utilisateur.
          Obtenez les prompts, l&apos;architecture et les automatismes pour
          lancer votre SaaS.
        </p>

        <div className="mt-10">
          <MagneticButton href="/auth" className="h-12 px-7 text-base">
            Accéder à l&apos;Académie SaaS
            <ArrowRight className="size-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

function MethodSection() {
  return (
    <section className="border-t border-white/10 px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400">
            La Méthode
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Trois piliers pour lancer votre SaaS
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-8 transition-colors duration-200 hover:border-white/20"
            >
              <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-violet-600/15 text-violet-400">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section className="border-t border-white/10 px-6 py-24 sm:py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400">
          Tarif
        </span>
        <h2 className="mt-3 text-balance text-center text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
          Un accès, tout le programme
        </h2>

        <div className="mt-14 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/50 p-10">
          <p className="text-sm font-medium text-zinc-400">
            Accès à l&apos;Académie
          </p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-5xl font-semibold tracking-tight text-zinc-100">
              49€
            </span>
            <span className="text-sm text-zinc-500">/ mois</span>
          </div>

          <ul className="mt-8 flex flex-col gap-3.5">
            {PRICING_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-600/15 text-violet-400">
                  <Check className="size-3" />
                </span>
                <span className="text-sm leading-relaxed text-zinc-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <MagneticButton
            href="/auth"
            className="mt-9 h-11 w-full text-sm"
          >
            Commencer maintenant
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <p className="text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Académie SaaS
      </p>
    </footer>
  )
}
