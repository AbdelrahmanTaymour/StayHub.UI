"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { Button } from "@/components/ui/button"
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite"
import { useAuth } from "@/providers/AuthContext"
import { cn } from "cn"

interface SaveApartmentButtonProps {
  apartmentId: string
  isFavorited?: boolean
  className?: string
}

export function SaveApartmentButton({
  apartmentId,
  isFavorited: serverIsFavorited,
  className,
}: SaveApartmentButtonProps) {
  const t = useTranslations("favorites")
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  const [isFavorited, setIsFavorited] = useState(serverIsFavorited ?? false)
  const [syncedServerValue, setSyncedServerValue] = useState(serverIsFavorited)

  if (serverIsFavorited !== syncedServerValue) {
    setSyncedServerValue(serverIsFavorited)
    setIsFavorited(serverIsFavorited ?? false)
  }

  const toggle = useToggleFavorite(apartmentId)

  function handleToggle() {
    if (!isAuthenticated || toggle.isPending) return

    const next = !isFavorited
    setIsFavorited(next)
    toggle.mutate(next, {
      onError: () => setIsFavorited(!next),
    })
  }

  const button = (
    <Button
      type="button"
      variant="outline"
      aria-pressed={isFavorited}
      disabled={toggle.isPending}
      onClick={handleToggle}
      className={cn("h-10 flex-1 gap-2 sm:flex-initial", className)}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          "size-4",
          isFavorited && "fill-destructive text-destructive"
        )}
      />
      {t("save")}
    </Button>
  )

  if (isAuthenticated) return button

  return (
    <LoginPromptPopover message={t("loginMessage")}>
      {button}
    </LoginPromptPopover>
  )
}
