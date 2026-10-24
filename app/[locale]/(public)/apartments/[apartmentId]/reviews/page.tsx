import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { getApartmentDetailsServer } from "@/features/apartments/api/apartments.server"
import { getApartmentReviewsServer } from "@/features/reviews/api/reviews.server"
import { ApartmentReviewsPageView } from "@/features/reviews/components/ApartmentReviewsPageView"
import {
  getPublicReviewRating,
  getPublicReviewSort,
} from "@/features/reviews/utils/apartment-review-filters"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

const PAGE_SIZE = 10

interface ApartmentReviewsPageProps {
  params: Promise<{ locale: string; apartmentId: string }>
  searchParams: Promise<{ rating?: string; sort?: string; page?: string }>
}

export async function generateMetadata({
  params,
}: ApartmentReviewsPageProps): Promise<Metadata> {
  const { apartmentId } = await params
  const apartment = await getApartmentDetailsServer(apartmentId)
  const t = await getTranslations("apartmentReviewsPage")
  return {
    title: apartment
      ? t("metaTitle", { name: apartment.name ?? t("pageTitleFallback") })
      : t("pageTitleFallback"),
    description: t("metaDescription"),
  }
}

export default async function ApartmentReviewsPage({
  params,
  searchParams,
}: ApartmentReviewsPageProps) {
  const { apartmentId } = await params
  const { rating, sort, page: pageParam } = await searchParams

  const apartment = await getApartmentDetailsServer(apartmentId)
  if (!apartment) notFound()

  const resolvedRating = getPublicReviewRating(rating)
  const sortOrder = getPublicReviewSort(sort)
  const page = Number(pageParam) || 1

  const t = await getTranslations("apartmentReviewsPage")
  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.reviews.byApartmentList(
      apartmentId,
      undefined,
      resolvedRating,
      sortOrder,
      page
    ),
    queryFn: () =>
      getApartmentReviewsServer(apartmentId, {
        rating: resolvedRating,
        sortOrder,
        page,
        pageSize: PAGE_SIZE,
      }),
  })

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-8">
      <PageBreadcrumb
        items={[
          {
            label: apartment.name ?? t("pageTitleFallback"),
            href: `/apartments/${apartmentId}`,
          },
          { label: t("breadcrumbReviews") },
        ]}
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ApartmentReviewsPageView
          apartmentId={apartmentId}
          apartmentName={apartment.name ?? t("pageTitleFallback")}
          overallRating={apartment.rating}
          overallReviewCount={apartment.reviewCount}
        />
      </HydrationBoundary>
    </div>
  )
}
