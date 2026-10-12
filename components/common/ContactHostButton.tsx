"use client"

import { MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"

import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthContext"
import { cn } from "cn"

interface ContactHostButtonProps {
  text?: string
  recipientId: string
  apartmentId?: string
  bookingId?: string
  conversationId?: string
  className?: string
}

export function ContactHostButton({
  text,
  recipientId,
  apartmentId,
  bookingId,
  conversationId,
  className,
}: ContactHostButtonProps) {
  const t = useTranslations("owner")
  const router = useRouter()
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  const params = new URLSearchParams({ recipientId })

  if (apartmentId) params.set("apartmentId", apartmentId)
  if (bookingId) params.set("bookingId", bookingId)

  const href = conversationId
    ? `/me/chats/${conversationId}`
    : `/me/chats/new?${params.toString()}`

  const button = (
    <Button
      type="button"
      variant="outline"
      className={cn(className)}
      onClick={() => {
        if (isAuthenticated) {
          router.push(href)
        }
      }}
    >
      <MessageCircle aria-hidden="true" className="size-4" />
      {text ?? t("messageHost")}
    </Button>
  )

  if (isAuthenticated) return button

  return (
    <LoginPromptPopover message={t("contactLoginMessage")}>
      {button}
    </LoginPromptPopover>
  )
}
