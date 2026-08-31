"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  Layers,
  Users,
  Palette,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

type Domain = {
  id: string
  label: string
  description: string
  icon: typeof ShoppingCart
}

const DOMAINS: Domain[] = [
  {
    id: "ecommerce",
    label: "E-commerce",
    description: "Vente en ligne",
    icon: ShoppingCart,
  },
  {
    id: "saas",
    label: "SaaS",
    description: "Logiciel par abonnement",
    icon: Layers,
  },
  {
    id: "agence",
    label: "Agence",
    description: "Services aux clients",
    icon: Users,
  },
  {
    id: "creatif",
    label: "Créatif",
    description: "Contenu & portfolio",
    icon: Palette,
  },
]

const MIN_PROBLEM_LENGTH = 15
const TOTAL_STEPS = 3

export function OnboardingAssistant() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [domainId, setDomainId] = useState<string | null>(null)
  const [problem, setProblem] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  const selectedDomain = DOMAINS.find((d) => d.id === domainId)
  const canContinueStep2 = problem.trim().length >= MIN_PROBLEM_LENGTH

  function handleSelectDomain(id: string) {
    setDomainId(id)
    setStep(2)
  }

  async function handleGenerate() {
    if (!selectedDomain || isGenerating) return

    setIsGenerating(true)
    setGenerationError(null)

    const supabase = createClient()
    const { error } = await supabase.from("projets").insert({
      domaine: selectedDomain.id,
      probleme: problem.trim(),
    })

    if (error) {
      console.log("[v0] Erreur lors de l'insertion du projet Supabase:", error.message)
      setGenerationError("Une erreur est survenue. Veuillez réessayer.")
      setIsGenerating(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-xl">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === step
            const isDone = stepNumber < step
            return (
              <div
                key={stepNumber}
                className={cn(
                  "h-1 w-10 rounded-full transition-all duration-500",
                  isActive && "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]",
                  isDone && "bg-violet-500/40",
                  !isActive && !isDone && "bg-white/10"
                )}
              />
            )
          })}
        </div>

        {/* Glass container */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {step === 1 && (
            <div
              key="step-1"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <p className="text-xs font-medium tracking-wide text-zinc-400">
                Étape 1 sur {TOTAL_STEPS}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Quel est votre domaine ?
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Choisissez la catégorie qui décrit le mieux votre projet.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {DOMAINS.map((domain) => {
                  const Icon = domain.icon
                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => handleSelectDomain(domain.id)}
                      className="group flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                    >
                      <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors duration-200 group-hover:border-violet-500/40 group-hover:text-violet-400">
                        <Icon className="size-5" />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium tracking-tight text-white">
                          {domain.label}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {domain.description}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div
              key="step-2"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <p className="text-xs font-medium tracking-wide text-zinc-400">
                Étape 2 sur {TOTAL_STEPS}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Quel problème résolvez-vous ?
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Décrivez en quelques mots le problème que votre application doit
                résoudre.
              </p>

              <div className="mt-8 flex flex-col gap-2">
                <Textarea
                  autoFocus
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Ex : Mes clients perdent du temps à suivre leurs commandes manuellement..."
                  className="min-h-32 resize-none rounded-xl border-white/10 bg-white/[0.02] text-base text-white placeholder:text-zinc-500 focus-visible:border-violet-500/50 focus-visible:ring-2 focus-visible:ring-violet-500/50 md:text-sm"
                />
                <div className="flex items-center justify-end">
                  <span
                    className={cn(
                      "text-xs tracking-wide",
                      canContinueStep2 ? "text-zinc-500" : "text-zinc-500"
                    )}
                  >
                    {problem.trim().length}/{MIN_PROBLEM_LENGTH} caractères minimum
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeft data-icon="inline-start" />
                  Retour
                </Button>
                <Button
                  type="button"
                  disabled={!canContinueStep2}
                  onClick={() => setStep(3)}
                  className="bg-violet-500 text-white hover:bg-violet-400 disabled:opacity-30"
                >
                  Continuer
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && selectedDomain && (
            <div
              key="step-3"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <p className="text-xs font-medium tracking-wide text-zinc-400">
                Étape 3 sur {TOTAL_STEPS}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Prêt à lancer votre projet
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Voici un résumé avant de générer votre application.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-400">
                    <selectedDomain.icon className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium tracking-wide text-zinc-400">
                      Domaine
                    </span>
                    <span className="text-sm font-medium text-white">
                      {selectedDomain.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-400">
                    <Check className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium tracking-wide text-zinc-400">
                      Problème à résoudre
                    </span>
                    <span className="text-sm leading-relaxed text-white">
                      {problem}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  type="button"
                  size="lg"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className={cn(
                    "h-12 w-full gap-2 rounded-xl bg-violet-500 text-base font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:bg-violet-400 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] disabled:opacity-80",
                    !isGenerating && "animate-pulse hover:animate-none",
                  )}
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : (
                    <Sparkles data-icon="inline-start" />
                  )}
                  {isGenerating ? "Génération en cours..." : "Générer mon SaaS"}
                </Button>
                {generationError && (
                  <p className="text-center text-xs text-red-400">{generationError}</p>
                )}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isGenerating}
                  className="text-center text-xs text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-50"
                >
                  Modifier mes réponses
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
