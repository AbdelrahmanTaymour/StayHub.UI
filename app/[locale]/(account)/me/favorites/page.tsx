import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { PageHeader } from "@/components/common/PageHeader"
import { ApartmentGridSkeleton } from "@/features/apartments/components/ApartmentGrid"
import { FavoritesList } from "@/features/favorites/components/FavoritesList"

interface FavoritesPageProps {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("favorites")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

export default async function FavoritesPage({
  searchParams,
}: FavoritesPageProps) {
  const t = await getTranslations("favorites")
  const { page: pageParam } = await searchParams
  const page = parsePage(pageParam)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
      <PageHeader title={t("pageTitle")} meta={t("pageDescription")} />

      <Suspense key={page} fallback={<ApartmentGridSkeleton />}>
        <FavoritesList page={page} />
      </Suspense>
    </div>
  )
}

function parsePage(value: string | undefined): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}
