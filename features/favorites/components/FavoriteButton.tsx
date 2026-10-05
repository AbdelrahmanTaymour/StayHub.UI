"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite"
import { useAuth } from "@/providers/AuthContext"
import { cn } from "cn"

interface FavoriteButtonProps {
  apartmentId: string
  isFavorited?: boolean
  className?: string
}

export function FavoriteButton({
  apartmentId,
  isFavorited = false,
  className,
}: FavoriteButtonProps) {
  const tFavorites = useTranslations("favorites")
  const tActions = useTranslations("apartmentDetails.actions")
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"
  const toggle = useToggleFavorite(apartmentId)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated || toggle.isPending) return
    toggle.mutate(!isFavorited)
  }

  const button = (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      aria-pressed={isFavorited}
      aria-label={isFavorited ? tFavorites("remove") : tFavorites("add")}
      disabled={toggle.isPending}
      onClick={handleClick}
      className={cn(
        "relative z-10 rounded-full shadow-sm backdrop-blur-sm",
        isFavorited && "text-destructive",
        className
      )}
    >
      <Heart
        className={cn("size-4", isFavorited && "fill-current")}
        aria-hidden="true"
      />
    </Button>
  )

  if (isAuthenticated) return button

  return (
    <LoginPromptPopover message={tActions("loginToSave")}>
      {button}
    </LoginPromptPopover>
  )
}
