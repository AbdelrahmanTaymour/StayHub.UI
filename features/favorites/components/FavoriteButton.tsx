"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, type MouseEvent } from "react"

import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthContext"
import { cn } from "cn"
import { useToggleFavorite } from "../hooks/useToggleFavorite"

interface FavoriteButtonProps {
  apartmentId: string
  isFavorited?: boolean
  className?: string
}

/**
 * Toggle button for apartment cards. Works in any list, including server-rendered ones,
 * because it keeps its own state in sync with the prop.
 */
export function FavoriteButton({
  apartmentId,
  isFavorited = false,
  className,
}: FavoriteButtonProps) {
  const t = useTranslations("favorites")
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"
  const toggle = useToggleFavorite(apartmentId)

  // Optimistic state. Resyncs when the server value changes (refresh, navigation).
  const [pressed, setPressed] = useState(isFavorited)
  const [syncedValue, setSyncedValue] = useState(isFavorited)
  if (isFavorited !== syncedValue) {
    setSyncedValue(isFavorited)
    setPressed(isFavorited)
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // Sits on top of the card's stretched link, so the click must not navigate.
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated || toggle.isPending) return

    const next = !pressed
    setPressed(next)
    toggle.mutate(next, {
      onError: () => setPressed(!next),
    })
  }

  const button = (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      aria-pressed={pressed}
      aria-label={t("label")}
      disabled={toggle.isPending}
      onClick={handleClick}
      className={cn(
        "relative z-10 rounded-full shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn("size-4", pressed && "fill-destructive text-destructive")}
      />
    </Button>
  )

  if (isAuthenticated) return button

  return (
    <LoginPromptPopover message={t("loginMessage")}>
      {button}
    </LoginPromptPopover>
  )
}
