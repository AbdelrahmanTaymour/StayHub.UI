import { User } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ApartmentDetails } from "@/features/apartments/types/apartment-details"
import { MessageHostButton } from "./MessageHostButton"

interface ApartmentHostCardProps {
  host: ApartmentDetails["host"]
}

export function ApartmentHostCard({ host }: ApartmentHostCardProps) {
  const t = useTranslations("apartmentDetails.host")
  const name = host?.fullName ?? t("fallbackName")

  return (
    <section
      aria-labelledby="apartment-host-heading"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-14">
          <AvatarImage src={host?.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>
            <User aria-hidden="true" className="size-6" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2
            id="apartment-host-heading"
            className="truncate text-lg font-semibold text-foreground"
          >
            {t("title", { name })}
          </h2>
          <p className="text-sm text-muted-foreground">{t("readyToHelp")}</p>
        </div>
      </div>

      <MessageHostButton />
    </section>
  )
}
