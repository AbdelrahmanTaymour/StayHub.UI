"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/toast"

import { Link } from "@/i18n/navigation"
import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { addFavorite, removeFavorite } from "@/features/favorites/api/favorites"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  apartmentId: string
  initialIsFavorited?: boolean
  className?: string
}

export function FavoriteButton({
  apartmentId,
  initialIsFavorited = false,
  className,
}: FavoriteButtonProps) {
  const t = useTranslations("favorites")
  const queryClient = useQueryClient()
  const { status } = useSession() // "authenticated" | "unauthenticated" | "loading"

  const [isFavorited, setIsFavorited] = React.useState(initialIsFavorited)
  const [promptOpen, setPromptOpen] = React.useState(false)

  const [prevInitial, setPrevInitial] = React.useState(initialIsFavorited)
  if (initialIsFavorited !== prevInitial) {
    setPrevInitial(initialIsFavorited)
    setIsFavorited(initialIsFavorited)
  }

  const mutation = useMutation({
    mutationFn: (next: boolean) =>
      next ? addFavorite(apartmentId) : removeFavorite(apartmentId),
    onMutate: (next) => setIsFavorited(next),
    onError: (_error, next) => {
      setIsFavorited(!next)
      toast.add({ title: t("updateErrorToast"), type: "error" })
    },
    onSuccess: (_data, next) => {
      toast.add({
        title: next ? t("addedToast") : t("removedToast"),
        type: "success",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments", "search"] })
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
    },
  })

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    if (status === "loading" || mutation.isPending) return

    if (status === "unauthenticated") {
      setPromptOpen(true)
      return
    }

    setPromptOpen(false)
    mutation.mutate(!isFavorited)
  }

  return (
    <Popover
      open={status === "unauthenticated" && promptOpen}
      onOpenChange={(open) => {
        if (status === "unauthenticated") {
          setPromptOpen(open)
        }
      }}
    >
      <PopoverTrigger
        type="button"
        aria-pressed={isFavorited}
        aria-label={isFavorited ? t("remove") : t("add")}
        disabled={mutation.isPending || status === "loading"}
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
