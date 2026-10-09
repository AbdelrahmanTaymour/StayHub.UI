"use client"

import { Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function CopyAddressButton({ address }: { address: string }) {
  const t = useTranslations("bookings.detail")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
    } catch {
      // Silently ignore — the address is already visible as text on the page.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={handleCopy}
      aria-label={copied ? t("addressCopied") : t("copyAddress")}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
    </Button>
  )
}
