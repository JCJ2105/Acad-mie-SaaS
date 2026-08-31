"use client"

import Link from "next/link"
import { useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  href: string
  children: ReactNode
  className?: string
  variant?: "primary" | "outline"
}

const STRENGTH = 0.35
const MAX_OFFSET = 10

export function MagneticButton({
  href,
  children,
  className,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    setOffset({
      x: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, x * STRENGTH)),
      y: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y * STRENGTH)),
    })
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 })
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[transform,box-shadow,background-color] duration-200 ease-out",
        variant === "primary" &&
          "bg-violet-600 text-white shadow-[0_0_0_1px_rgba(167,139,250,0.3),0_8px_30px_-8px_rgba(124,58,237,0.6)] hover:bg-violet-500 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.4),0_10px_40px_-6px_rgba(124,58,237,0.75)]",
        variant === "outline" &&
          "border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06] hover:text-white",
        className,
      )}
    >
      {children}
    </Link>
  )
}
