"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite"
import { cn } from "cn"
import { useAuth } from "@/providers/AuthContext"

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
  const t = useTranslations("favorites")
  const { status } = useAuth()
  const [promptOpen, setPromptOpen] = React.useState(false)
  const toggle = useToggleFavorite(apartmentId)

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    if (toggle.isPending) return

    if (status === "unauthenticated") {
      setPromptOpen(true)
      return
    }

    setPromptOpen(false)
    toggle.mutate(!isFavorited)
  }

  return (
    <Popover
      open={status === "unauthenticated" && promptOpen}
      onOpenChange={(open) => {
        if (status === "unauthenticated") setPromptOpen(open)
      }}
    >
      <PopoverTrigger
        type="button"
        aria-pressed={isFavorited}
        aria-label={isFavorited ? t("remove") : t("add")}
        disabled={toggle.isPending}
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon-sm" }),
          "relative z-2 rounded-full shadow-sm backdrop-blur-sm",
          isFavorited && "text-destructive",
          className
        )}
      >
        <Heart
          className={cn("size-4", isFavorited && "fill-current")}
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 text-sm">
        <p>
          {t.rich("loginPrompt", {
            login: (chunks) => (
              <Link
                href="/login"
                className="font-medium text-primary underline underline-offset-4"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </PopoverContent>
    </Popover>
  )
}
