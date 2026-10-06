import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

import { SortSelect } from "@/components/common/SortSelect"
import {
  DEFAULT_OWNER_SORT,
  OWNER_SORT_OPTIONS,
} from "@/features/apartments/utils/owner-sort"
import type { OwnerProfile } from "@/features/users/types/owner-profile"
import { OwnerProfileHero } from "./OwnerProfileHero"

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

  const sortOptions = OWNER_SORT_OPTIONS.map(({ value }) => ({
    value,
    label: t(`sort.${value}`),
  }))

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
      <OwnerProfileHero owner={owner} />

      <section
        aria-labelledby="owner-listings-heading"
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <h2
              id="owner-listings-heading"
              className="text-lg font-semibold text-foreground"
            >
              {t("propertiesHeading", { name })}
            </h2>
            <p className="text-sm text-foreground">
              {t("listingsCount", { count: listingsCount })}
            </p>
          </div>

          <SortSelect
            label={t("sortLabel")}
            options={sortOptions}
            defaultValue={DEFAULT_OWNER_SORT}
          />
        </div>

        {listings}
        {pagination}
      </section>
    </div>
  )
}
