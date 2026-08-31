import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="relative w-full max-w-sm">
        <div
          aria-hidden="true"
          className="absolute -inset-24 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.16),transparent_60%)]"
        />
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Une erreur est survenue
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Impossible de finaliser votre connexion. Le lien a peut-être expiré.
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-500"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
