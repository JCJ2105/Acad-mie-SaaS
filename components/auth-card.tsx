"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import type { AuthError } from "@supabase/supabase-js"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"

type OAuthProvider = "google" | "apple"

function getRedirectTo() {
  return (
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
    `${window.location.origin}/auth/callback`
  )
}

function getFriendlyAuthError(error: AuthError, mode: Mode): string {
  const code = (error as { code?: string }).code
  const message = error.message.toLowerCase()

  if (mode === "signin") {
    if (code === "email_not_confirmed" || message.includes("not confirmed")) {
      return "Veuillez confirmer votre email avant de vous connecter."
    }
    if (code === "invalid_credentials" || message.includes("invalid login")) {
      return "Email ou mot de passe incorrect."
    }
  } else {
    if (code === "user_already_exists" || message.includes("already registered")) {
      return "Un compte existe déjà avec cet email."
    }
    if (code === "weak_password" || message.includes("password")) {
      return "Le mot de passe doit contenir au moins 6 caractères."
    }
    if (message.includes("invalid") && message.includes("email")) {
      return "Adresse email invalide."
    }
  }

  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "Trop de tentatives. Veuillez réessayer dans un instant."
  }

  return "Une erreur est survenue. Veuillez réessayer."
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.15.8 3.87 1.5l2.64-2.55C16.85 3.15 14.6 2 12 2 6.98 2 3 5.98 3 12s3.98 10 9 10c5.2 0 8.6-3.65 8.6-8.8 0-.6-.06-1.05-.14-1.5H12z"
      />
    </svg>
  )
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.36 1c.12 1.05-.29 2.08-.9 2.83-.64.79-1.72 1.4-2.76 1.32-.14-1.02.34-2.09.94-2.79C14.29 1.5 15.36.93 16.36 1Zm2.99 7.44c-.06.04-1.79.99-1.77 3.13.02 2.58 2.28 3.42 2.31 3.43-.02.06-.36 1.24-1.19 2.44-.73 1.06-1.5 2.11-2.7 2.13-1.18.02-1.56-.7-2.91-.7-1.35 0-1.77.68-2.89.72-1.16.04-2.05-1.13-2.79-2.19-1.5-2.16-2.66-6.1-1.11-8.77.76-1.33 2.14-2.17 3.63-2.19 1.16-.02 1.94.7 2.92.7.98 0 1.6-.7 2.9-.7.98.02 2.04.34 2.6 1z" />
    </svg>
  )
}

type Mode = "signin" | "signup"

export function AuthCard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<Mode>("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null)
  const [formMessage, setFormMessage] = useState<{
    type: "error" | "info"
    text: string
  } | null>(null)
  const isSignup = mode === "signup"
  const isBusy = isSubmitting || oauthLoading !== null

  const nextPath = searchParams.get("next") ?? "/dashboard"

  function switchMode(next: Mode) {
    setMode(next)
    setFormMessage(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isBusy) return

    setFormMessage(null)
    setIsSubmitting(true)

    const supabase = createClient()

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectTo(),
          data: { first_name: firstName },
        },
      })

      if (error) {
        setFormMessage({ type: "error", text: getFriendlyAuthError(error, mode) })
        setIsSubmitting(false)
        return
      }

      if (data.session) {
        router.push(nextPath)
        return
      }

      setFormMessage({
        type: "info",
        text: "Vérifiez votre boîte mail pour confirmer votre compte.",
      })
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setFormMessage({ type: "error", text: getFriendlyAuthError(error, mode) })
      setIsSubmitting(false)
      return
    }

    router.push(nextPath)
  }

  async function handleOAuth(provider: OAuthProvider) {
    if (isBusy) return

    setFormMessage(null)
    setOauthLoading(provider)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getRedirectTo() },
    })

    if (error) {
      setFormMessage({ type: "error", text: getFriendlyAuthError(error, mode) })
      setOauthLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="relative w-full max-w-sm">
        <div
          aria-hidden="true"
          className="absolute -inset-24 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.16),transparent_60%)]"
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
              <Sparkles className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Accédez à votre espace
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {isSignup
                ? "Créez votre compte pour commencer."
                : "Connectez-vous pour continuer votre progression."}
            </p>
          </div>

          <form
            key={mode}
            onSubmit={handleSubmit}
            className="animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            <FieldGroup className="gap-4">
              {isSignup && (
                <Field>
                  <FieldLabel
                    htmlFor="first-name"
                    className="text-zinc-300"
                  >
                    Prénom
                  </FieldLabel>
                  <Input
                    id="first-name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Camille"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isBusy}
                    className="h-10 rounded-lg border-white/10 bg-white/[0.03] px-3 text-white placeholder:text-zinc-500 focus-visible:border-violet-500/60 focus-visible:ring-4 focus-visible:ring-violet-500/20"
                  />
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="text-zinc-300">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isBusy}
                  required
                  className="h-10 rounded-lg border-white/10 bg-white/[0.03] px-3 text-white placeholder:text-zinc-500 focus-visible:border-violet-500/60 focus-visible:ring-4 focus-visible:ring-violet-500/20"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-zinc-300">
                    Mot de passe
                  </FieldLabel>
                  {!isSignup && (
                    <button
                      type="button"
                      className="text-xs text-zinc-400 transition-colors hover:text-violet-400"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBusy}
                    required
                    minLength={6}
                    className="h-10 rounded-lg border-white/10 bg-white/[0.03] px-3 pr-10 text-white placeholder:text-zinc-500 focus-visible:border-violet-500/60 focus-visible:ring-4 focus-visible:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </Field>

              {formMessage && (
                <p
                  className={cn(
                    "text-center text-xs",
                    formMessage.type === "error" ? "text-red-400" : "text-zinc-400",
                  )}
                  role="status"
                >
                  {formMessage.text}
                </p>
              )}

              <Button
                type="submit"
                disabled={isBusy}
                className="h-10 w-full rounded-lg bg-violet-600 text-white shadow-[0_0_0_1px_rgba(167,139,250,0.3),0_8px_24px_-6px_rgba(124,58,237,0.55)] hover:bg-violet-500 focus-visible:ring-4 focus-visible:ring-violet-500/50 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                ) : null}
                {isSubmitting
                  ? "Chargement..."
                  : isSignup
                    ? "Créer mon compte"
                    : "Se connecter"}
              </Button>
            </FieldGroup>
          </form>

          <FieldSeparator className="my-6 text-zinc-500 [&_[data-slot=field-separator-content]]:bg-[#131316] [&_[data-slot=field-separator-content]]:text-zinc-500">
            ou
          </FieldSeparator>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleOAuth("google")}
              className="h-10 w-full justify-center rounded-lg border-white/10 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white disabled:opacity-70"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              ) : (
                <GoogleIcon className="size-4" data-icon="inline-start" />
              )}
              Continuer avec Google
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleOAuth("apple")}
              className="h-10 w-full justify-center rounded-lg border-white/10 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white disabled:opacity-70"
            >
              {oauthLoading === "apple" ? (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              ) : (
                <AppleIcon className="size-4" data-icon="inline-start" />
              )}
              Continuer avec Apple
            </Button>
          </div>

          <p className="mt-7 text-center text-sm text-zinc-400">
            {isSignup ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? "signin" : "signup")}
              disabled={isBusy}
              className="font-medium text-violet-400 transition-colors hover:text-violet-300 disabled:opacity-70"
            >
              {isSignup ? "Se connecter" : "Créer un compte"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
