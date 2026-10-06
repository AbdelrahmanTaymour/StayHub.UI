import { User } from "lucide-react"
import { useTranslations } from "next-intl"

import { ExpandableText } from "@/components/common/ExpandableText"
import { RatingSummary } from "@/components/common/RatingSummary"
import { ShareButton } from "@/components/common/ShareButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import type { OwnerProfile } from "@/features/users/types/owner-profile"
import { ContactHostButton } from "./ContactHostButton"

interface OwnerProfileHeroProps {
  owner: OwnerProfile
}

export function OwnerProfileHero({ owner }: OwnerProfileHeroProps) {
  const t = useTranslations("owner")
  const name = owner.fullName ?? t("fallbackName")
  const bio = owner.bio?.trim()

  return (
    <Card
      as="section"
      aria-labelledby="owner-name"
      className="gap-6 p-6 md:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-28 shrink-0 shadow-md sm:size-32">
            <AvatarImage src={owner.avatarUrl ?? undefined} alt="" />
            <AvatarFallback>
              <User aria-hidden="true" className="size-10" />
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col gap-2">
            <h1
              id="owner-name"
              className="text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              {name}
            </h1>
            <RatingSummary
              rating={owner.rating}
              reviewCount={owner.reviewCount}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <ContactHostButton />
          <ShareButton />
        </div>
      </div>

      {bio ? (
        <ExpandableText text={bio} className="max-w-4xl" />
      ) : (
        <p className="line-clamp-4 leading-relaxed whitespace-pre-line text-foreground">
          {t("noBio")}
        </p>
      )}
    </Card>
  )
}
