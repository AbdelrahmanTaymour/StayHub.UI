"use client"

import { useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"

import type { ApartmentCardData } from "@/components/common/ApartmentCard"
import { Pagination } from "@/components/common/Pagination"
import { EmptyState } from "@/components/feedback/EmptyState"
import { buttonVariants } from "@/components/ui/button"
import { ApartmentGrid } from "@/features/apartments/components/ApartmentGrid"
import { getFavorites } from "@/features/favorites/api/favorites"
import { Link } from "@/i18n/navigation"
import { queryKeys } from "@/lib/query/query-keys"
import { cn } from "cn"
import { GetFavoritesQuery } from "@/lib/api/types/favorites"

type FavoritesResponse = Awaited<ReturnType<typeof getFavorites>>

interface FavoritesGridProps {
  query: GetFavoritesQuery
  initialData: FavoritesResponse
}

export function FavoritesGrid({ query, initialData }: FavoritesGridProps) {
  const t = useTranslations("favorites")

  const { data } = useQuery({
    queryKey: queryKeys.favorites.list(query),
    queryFn: () => getFavorites(query),
    initialData,
  })

  const apartments: ApartmentCardData[] = (data.items ?? []).map((item) => ({
    id: item.apartmentId,
    name: item.name,
    city: item.city,
    country: item.country,
    pricePerNight: item.pricePerNight,
    currency: item.currency,
    primaryImageUrl: item.primaryImageUrl,
    rating: item.rating,
    reviewCount: item.reviewCount,
    isFavorited: true,
  }))

  if (apartments.length === 0) {
    return (
      <EmptyState
        icon={<Heart aria-hidden="true" className="size-10" />}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        action={
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            {t("browseApartments")}
          </Link>
        }
      />
    )
  }

  return (
    <>
      <h2 className="sr-only">{t("listHeading")}</h2>
      <ApartmentGrid apartments={apartments} priorityCount={4} />
      <Pagination
        page={data.page ?? query.page ?? 1}
        totalPages={data.totalPages ?? 1}
      />
    </>
  )
}
