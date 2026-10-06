"use client"

import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ScrollToResultsButtonProps {
  targetId: string
  label: string
}

export function ScrollToResultsButton({
  targetId,
  label,
}: ScrollToResultsButtonProps) {
  function handleClick() {
    const target = document.getElementById(targetId)
    if (!target) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    target.focus({ preventScroll: true })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      className="group flex-col gap-1 text-sm font-medium text-foreground"
    >
      <span>{label}</span>
      <ChevronDown
        aria-hidden="true"
        className="size-5 animate-bounce transition-transform group-hover:translate-y-0.5 motion-reduce:animate-none"
      />
    </Button>
  )
}
