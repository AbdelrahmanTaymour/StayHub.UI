"use client"

import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { RatingSummary } from "@/components/common/RatingSummary"
import { getOwnerProfile } from "@/features/users/api/users"
import { queryKeys } from "@/lib/query/query-keys"

interface OwnerPreviewDialogProps {
  ownerId: string | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OwnerPreviewDialog({
  ownerId,
  open,
  onOpenChange,
}: OwnerPreviewDialogProps) {
  const t = useTranslations("chats.ownerPreview")

  const { data, isPending } = useQuery({
    queryKey: ownerId
      ? queryKeys.users.ownerProfile(ownerId)
      : ["users", "ownerProfile", "none"],
    queryFn: () => getOwnerProfile(ownerId!),
    enabled: open && Boolean(ownerId),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        {isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : data ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar className="size-20">
              <AvatarImage src={data.avatarUrl ?? undefined} alt="" />
              <AvatarFallback>
                <User aria-hidden="true" className="size-8" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-foreground">
              {data.fullName ?? t("fallbackName")}
            </h2>
            <RatingSummary
              rating={data.rating}
              reviewCount={data.reviewCount}
            />
            {data.bio ? (
              <p className="text-sm text-foreground">{data.bio}</p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
