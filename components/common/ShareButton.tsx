"use client"

import { Check, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

type ShareStatus = "idle" | "copied" | "failed"

const RESET_DELAY_MS = 2000

interface ShareButtonProps {
  /** Defaults to the current page URL. */
  url?: string
  className?: string
}

export function ShareButton({ url, className }: ShareButtonProps) {
  const t = useTranslations("common.share")
  const [status, setStatus] = useState<ShareStatus>("idle")

  useEffect(() => {
    if (status === "idle") return

    const timer = window.setTimeout(() => setStatus("idle"), RESET_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(url ?? window.location.href)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  const label =
    status === "copied"
      ? t("copied")
      : status === "failed"
        ? t("failed")
        : t("label")
  const Icon = status === "copied" ? Check : Share2

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleShare}
      className={cn("h-10 flex-1 gap-2 sm:flex-initial", className)}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span aria-live="polite">{label}</span>
    </Button>
  )
}
