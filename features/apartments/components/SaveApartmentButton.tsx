"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite"
import { useAuth } from "@/providers/AuthContext"
import { cn } from "cn"

interface SaveApartmentButtonProps {
  apartmentId: string
  initialIsFavorited: boolean
}

export function SaveApartmentButton({
  apartmentId,
  initialIsFavorited,
}: SaveApartmentButtonProps) {
  const t = useTranslations("apartmentDetails.actions")
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const { mutate, isPending } = useToggleFavorite(apartmentId)

  function handleToggle() {
    if (!isAuthenticated) return

    const next = !isFavorited
    setIsFavorited(next)
    // The hook handles the cache and the toast. This only rolls back the
    // local state so the button matches the server after a failure.
    mutate(next, { onError: () => setIsFavorited(!next) })
  }

  const button = (
    <Button
      type="button"
      variant="outline"
      aria-pressed={isFavorited}
      disabled={isPending}
      onClick={handleToggle}
      className="h-10 flex-1 gap-2 sm:flex-initial"
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
    <LoginPromptPopover message={t("loginToSave")}>{button}</LoginPromptPopover>
  )
}
