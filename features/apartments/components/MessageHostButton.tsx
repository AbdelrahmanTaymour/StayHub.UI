"use client"

import { MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { useAuth } from "@/providers/AuthContext"

/**
 * @todo Messaging isn't built yet, so signed-in users see a disabled button.
 * Anonymous users get the login prompt.
 */
export function MessageHostButton() {
  const t = useTranslations("apartmentDetails.host")
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  const button = (
    <Button
      type="button"
      variant="secondary"
      disabled={isAuthenticated}
      className="shrink-0 gap-2"
    >
      <MessageCircle aria-hidden="true" className="size-4" />
      {t("messageHost")}
    </Button>
  )

  if (isAuthenticated) return button

  return (
    <LoginPromptPopover message={t("loginToMessage")}>
      {button}
    </LoginPromptPopover>
  )
}
