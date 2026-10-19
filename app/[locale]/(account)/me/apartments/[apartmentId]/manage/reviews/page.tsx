import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { getApartmentReviewsServer } from "@/features/reviews/api/reviews.server"
import {
  getReviewRatingFilter,
  getReviewResponseTab,
  getReviewSortOrder,
} from "@/features/reviews/utils/apartment-review-filters"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"
import { ApartmentReviewsManager } from "@/features/reviews/components/ApartmentReviewsManager"

const PAGE_SIZE = 10

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.reviews")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

interface ReviewsTabPageProps {
  params: Promise<{ locale: string; apartmentId: string }>
  searchParams: Promise<{
    filter?: string
    rating?: string
    sort?: string
    page?: string
  }>
}

export default async function ApartmentReviewsTabPage({
  params,
  searchParams,
}: ReviewsTabPageProps) {
  const { locale, apartmentId } = await params
  const { filter, rating, sort, page: pageParam } = await searchParams
  setRequestLocale(locale)

  const responseStatus = getReviewResponseTab(filter)
  const resolvedRating = getReviewRatingFilter(rating)
  const sortOrder = getReviewSortOrder(sort)
  const page = Number(pageParam) || 1

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.reviews.byApartmentList(
      apartmentId,
      responseStatus,
      resolvedRating,
      sortOrder,
      page
    ),
    queryFn: () =>
      getApartmentReviewsServer(apartmentId, {
        responseStatus,
        rating: resolvedRating,
        sortOrder,
        page,
        pageSize: PAGE_SIZE,
      }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentReviewsManager apartmentId={apartmentId} />
    </HydrationBoundary>
  )
}
