"use client"

import { useState } from "react"
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Copy,
  GraduationCap,
  Lock,
  Terminal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type LessonStatus = "done" | "active" | "locked"

interface Lesson {
  id: string
  index: number
  title: string
  status: LessonStatus
}

const lessons: Lesson[] = [
  { id: "base", index: 1, title: "Créer la base", status: "done" },
  { id: "onboarding", index: 2, title: "L'Onboarding", status: "active" },
  { id: "auth", index: 3, title: "Authentification", status: "locked" },
  { id: "donnees", index: 4, title: "Modéliser les données", status: "locked" },
  { id: "api", index: 5, title: "Connecter une API", status: "locked" },
  { id: "deploiement", index: 6, title: "Déployer son app", status: "locked" },
]

const promptText = `Agis en tant qu'Architecte Logiciel Senior. Je souhaite créer une application SaaS dont le but est : [DÉCRIS TON IDÉE ICI EN 2 PHRASES].
Avant de coder, j'ai besoin d'une structure de base de données relationnelle parfaite (optimisée pour Supabase).
Génère-moi : 1. Les 3 à 5 tables principales strictement nécessaires pour lancer le MVP. 2. Les colonnes clés pour chaque table. 3. Les relations entre ces tables.
Explique-moi cette architecture simplement, sans code SQL complexe.`

function LessonStatusIcon({ status }: { status: LessonStatus }) {
  if (status === "done") {
    return <CheckCircle2 className="size-4 text-zinc-400" />
  }
  if (status === "active") {
    return <Circle className="size-4 fill-violet-500 text-violet-500" />
  }
  return <Lock className="size-3.5 text-zinc-600" />
}

export function Classroom() {
  const [activeLessonId, setActiveLessonId] = useState("onboarding")
  const [copied, setCopied] = useState(false)

  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[1]

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promptText)
    } catch {
      // Clipboard API unavailable — copy still reflected in the UI.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
            <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-violet-400">
              <GraduationCap className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100">
                Architecturer une App
              </p>
              <p className="text-xs text-zinc-500">Module 2 sur 6</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Leçons
            </p>
            <ul className="flex flex-col gap-1">
              {lessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId
                const isLocked = lesson.status === "locked"
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border-l-2 py-2.5 pl-3 pr-2 text-left text-sm transition-colors duration-150",
                        isActive
                          ? "border-violet-500 bg-zinc-800 text-zinc-100"
                          : "border-transparent text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300",
                        isLocked && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-zinc-500",
                      )}
                    >
                      <LessonStatusIcon status={lesson.status} />
                      <span className="min-w-0 flex-1 truncate">
                        {lesson.index}. {lesson.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-white/10 px-6 py-4">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Progression du module</span>
              <span className="font-medium text-zinc-300">33%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-1/3 rounded-full bg-violet-500" />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          <div className="mx-auto flex max-w-3xl flex-col px-8 py-14">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
              <span>Module 2</span>
              <ChevronRight className="size-3.5" />
              <span className="text-violet-400">
                Leçon {activeLesson.index}
              </span>
            </div>

            <h1 className="text-3xl font-medium tracking-tight text-zinc-100 sm:text-4xl">
              Chapitre 1 : L&apos;Architecte Fondateur
            </h1>

            <div className="mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-zinc-500">
              <p>
                Avant de coder la moindre ligne, une application solide
                commence par un schéma de données clair. L&apos;objectif
                n&apos;est pas de mémoriser la syntaxe, mais de formuler une
                demande structurée à l&apos;IA. Copiez le prompt ci-dessous
                dans votre assistant IA (ChatGPT, Claude) pour générer
                l&apos;architecture parfaite de votre base de données.
              </p>
            </div>

            {/* Prompt Box */}
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <Terminal className="size-3.5 text-violet-400" />
                  <span>Prompt à copier</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className={cn(
                    "h-7 gap-1.5 rounded-lg border-white/10 bg-zinc-900 px-2.5 text-xs text-zinc-400 transition-colors duration-150 hover:border-white/20 hover:bg-zinc-800 hover:text-zinc-200",
                    copied && "border-violet-500/40 text-violet-300",
                  )}
                >
                  {copied ? (
                    <Check className="size-3.5" data-icon="inline-start" />
                  ) : (
                    <Copy className="size-3.5" data-icon="inline-start" />
                  )}
                  {copied ? "Copié" : "Copier"}
                </Button>
              </div>
              <pre className="overflow-x-auto px-4 py-4">
                <code className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-zinc-300">
                  {promptText}
                </code>
              </pre>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:bg-zinc-800 hover:text-zinc-200"
              >
                Leçon précédente
              </Button>
              <Button
                type="button"
                className="rounded-lg bg-violet-600 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition-colors duration-150 hover:bg-violet-500"
              >
                Leçon suivante
                <ChevronRight className="size-4" data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
