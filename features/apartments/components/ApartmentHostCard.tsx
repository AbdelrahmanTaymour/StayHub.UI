import { User } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/i18n/navigation"
import type { ApartmentDetails } from "@/features/apartments/types/apartment-details"
import { MessageHostButton } from "./MessageHostButton"

interface ApartmentHostCardProps {
  host: ApartmentDetails["host"]
}

export function ApartmentHostCard({ host }: ApartmentHostCardProps) {
  const t = useTranslations("apartmentDetails.host")
  const name = host?.fullName ?? t("fallbackName")

  const heading = t.rich("title", {
    name,
    owner: (chunks) =>
      host?.id ? (
        <Link
          href={`/owners/${host.id}`}
          className="font-semibold text-tertiary underline-offset-4 hover:underline"
        >
          {chunks}
        </Link>
      ) : (
        <span className="font-semibold text-foreground">{chunks}</span>
      ),
  })

  return (
    <section
      aria-labelledby="apartment-host-heading"
      className="flex flex-col gap-4 border-t border-border p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage src={host?.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>
            <User aria-hidden="true" className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2
            id="apartment-host-heading"
            className="truncate text-base text-foreground"
          >
            {heading}
          </h2>
          <p className="text-sm text-foreground">{t("readyToHelp")}</p>
        </div>
      </div>

      <MessageHostButton />
    </section>
  )
}
