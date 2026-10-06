import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

import { ExpandableText } from "@/components/common/ExpandableText"
import { PageHeader } from "@/components/common/PageHeader"
import { RatingSummary } from "@/components/common/RatingSummary"
import { ShareButton } from "@/components/common/ShareButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import type { OwnerProfile } from "@/features/users/types/owner-profile"

interface OwnerProfileViewProps {
  owner: OwnerProfile
  listingsCount: number
  listings: ReactNode
  pagination: ReactNode
}

export function OwnerProfileView({
  owner,
  listingsCount,
  listings,
  pagination,
}: OwnerProfileViewProps) {
  const t = useTranslations("owner")
  const name = owner.fullName ?? t("fallbackName")
  const bio = owner.bio?.trim()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <PageHeader
        title={name}
        meta={
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <RatingSummary
              rating={owner.rating}
              reviewCount={owner.reviewCount}
            />
            <span aria-hidden="true">·</span>
            <span>
              {t("activeListings", { count: owner.activeListingsCount ?? 0 })}
            </span>
          </div>
        }
        actions={<ShareButton />}
      />

      <Card
        as="section"
        aria-labelledby="owner-about-heading"
        className="sm:flex-row sm:items-start"
      >
        <Avatar className="size-20 shrink-0">
          <AvatarImage src={owner.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>
            <User aria-hidden="true" className="size-8" />
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h2
            id="owner-about-heading"
            className="text-lg font-semibold text-foreground"
          >
            {t("aboutTitle")}
          </h2>
          {bio ? (
            <ExpandableText text={bio} />
          ) : (
            <p className="text-sm text-foreground">{t("noBio")}</p>
          )}
        </div>
      </Card>

      <section
        aria-labelledby="owner-listings-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
          <h2
            id="owner-listings-heading"
            className="text-xl font-semibold text-foreground"
          >
            {t("listingsTitle")}
          </h2>
          <p className="text-sm text-foreground">
            {t("listingsCount", { count: listingsCount })}
          </p>
        </div>

        {listings}
        {pagination}
      </section>
    </div>
  )
}
