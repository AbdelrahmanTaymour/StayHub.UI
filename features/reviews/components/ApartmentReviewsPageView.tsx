// features/reviews/components/ApartmentReviewsPageView.tsx
"use client"

import { MessageSquareOff } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { RatingSummary } from "@/components/common/RatingSummary"
import { SortSelect } from "@/components/common/SortSelect"
import { Pagination } from "@/components/common/Pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { useApartmentReviews } from "@/features/reviews/hooks/useApartmentReviews"
import {
  DEFAULT_PUBLIC_REVIEW_RATING,
  DEFAULT_PUBLIC_REVIEW_SORT,
  PUBLIC_REVIEW_RATING_FILTERS,
  PUBLIC_REVIEW_SORT_ORDERS,
  getPublicReviewRating,
  getPublicReviewSort,
} from "@/features/reviews/utils/apartment-review-filters"
import { PublicReviewCard } from "./PublicReviewCard"

const PAGE_SIZE = 10

interface ApartmentReviewsPageViewProps {
  apartmentId: string
  apartmentName: string
  overallRating?: number | null
  overallReviewCount?: number | null
}

export function ApartmentReviewsPageView({
  apartmentId,
  apartmentName,
  overallRating,
  overallReviewCount,
}: ApartmentReviewsPageViewProps) {
  const t = useTranslations("apartmentReviewsPage")
  const searchParams = useSearchParams()

  const rating = getPublicReviewRating(searchParams.get("rating") ?? undefined)
  const sortOrder = getPublicReviewSort(searchParams.get("sort") ?? undefined)
  const page = Number(searchParams.get("page")) || 1

  const { data, isPending, isPlaceholderData, isError, refetch } =
    useApartmentReviews(apartmentId, {
      rating,
      sortOrder,
      page,
      pageSize: PAGE_SIZE,
    })

  const showSkeleton = isPending || isPlaceholderData
  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">
          {t("pageTitle", { name: apartmentName })}
        </h1>
        <RatingSummary
          rating={overallRating}
          reviewCount={overallReviewCount}
        />
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <SortSelect
          label={t("ratingFilterLabel")}
          paramName="rating"
          defaultValue={DEFAULT_PUBLIC_REVIEW_RATING}
          options={PUBLIC_REVIEW_RATING_FILTERS.map((value) => ({
            value,
            label: t(`ratingFilters.${value}`),
          }))}
        />
        <SortSelect
          label={t("sortLabel")}
          paramName="sort"
          defaultValue={DEFAULT_PUBLIC_REVIEW_SORT}
          options={PUBLIC_REVIEW_SORT_ORDERS.map((value) => ({
            value,
            label: t(`sorts.${value}`),
          }))}
        />
      </div>

      {showSkeleton ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("retry")}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<MessageSquareOff className="size-10" />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {items.map((review) => (
              <PublicReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {t("showingCount", {
                count: items.length,
                total: data?.totalCount ?? 0,
              })}
            </span>
            <Pagination
              page={data?.page ?? page}
              totalPages={data?.totalPages ?? 1}
            />
          </div>
        </>
      )}
    </div>
  )
}
