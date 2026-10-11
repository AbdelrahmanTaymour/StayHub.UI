"use client"

import { MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useAuth } from "@/providers/AuthContext"

interface ContactHostButtonProps {
  text?: string
  /** Apartment details page, or a booking with no conversation yet: routes to the draft chat flow. */
  apartmentId?: string
  bookingId?: string
  /** Booking details page when `booking.conversationId` is already known: routes straight to that thread. */
  conversationId?: string
}

export function ContactHostButton({
  text,
  apartmentId,
  bookingId,
  conversationId,
}: ContactHostButtonProps) {
  const t = useTranslations("owner")
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  /* TODO: CHECK THIS IMPELEMENTATION */
  const href = conversationId
    ? `/me/chats/${conversationId}`
    : apartmentId
      ? `/me/chats/new?apartmentId=${apartmentId}${bookingId ? `&bookingId=${bookingId}` : ""}`
      : null

  const button = (
    <Link
      href={`/me/chats/new?apartmentId=${apartmentId}`}
      className={buttonVariants({ variant: "secondary" })}
    >
      <MessageCircle aria-hidden="true" className="size-4" />
      {t("messageHost")}
    </Link>
  )

  if (isAuthenticated) return button

  return (
    <LoginPromptPopover message={t("contactLoginMessage")}>
      {button}
    </LoginPromptPopover>
  )
}
