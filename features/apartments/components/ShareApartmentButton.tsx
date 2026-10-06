"use client"

import {  Share2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

type ShareStatus = "idle" | "copied" | "failed"

const RESET_DELAY_MS = 2000

export function ShareApartmentButton() {
  const t = useTranslations("apartmentDetails.actions")
  const [status, setStatus] = useState<ShareStatus>("idle")

  useEffect(() => {
    if (status === "idle") return

    const timer = window.setTimeout(() => setStatus("idle"), RESET_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  const labels: Record<ShareStatus, string> = {
    idle: t("share"),
    copied: t("copied"),
    failed: t("copyFailed"),
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleShare}
      className="h-10 flex-1 gap-2 sm:flex-initial"
    >
      <Share2 aria-hidden="true" className="size-4" />
      <span aria-live="polite">{labels[status]}</span>
    </Button>
  )
}
