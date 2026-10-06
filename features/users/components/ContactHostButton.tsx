"use client"

import { MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthContext"

/** @todo: Messaging isn't built yet. Signed-in users see a disabled button; visitors see the login prompt. */
export function ContactHostButton() {
  const t = useTranslations("owner")
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  const button = (
    <Button
      type="button"
      variant="outline"
      disabled={isAuthenticated}
      className="h-10 flex-1 gap-2 sm:flex-initial"
    >
      <MessageCircle aria-hidden="true" className="size-4" />
      {t("contactHost")}
    </Button>
  )

  if (isAuthenticated) return button

  return (
    <LoginPromptPopover message={t("contactLoginMessage")}>
      {button}
    </LoginPromptPopover>
  )
}
