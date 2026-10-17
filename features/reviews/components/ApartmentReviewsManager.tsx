"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { FilterTabs } from "@/components/common/FilterTabs"
import { SortSelect } from "@/components/common/SortSelect"
import { Pagination } from "@/components/common/Pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { useApartmentReviews } from "@/features/reviews/hooks/useApartmentReviews"
import {
  DEFAULT_REVIEW_RATING_FILTER,
  DEFAULT_REVIEW_RESPONSE_TAB,
  DEFAULT_REVIEW_SORT_ORDER,
  REVIEW_RATING_FILTERS,
  REVIEW_RESPONSE_TABS,
  REVIEW_SORT_ORDERS,
  getReviewRatingFilter,
  getReviewResponseTab,
  getReviewSortOrder,
} from "@/features/reviews/utils/apartment-review-filters"
import { ApartmentReviewCard } from "./ApartmentReviewCard"
import { MessageSquareOff } from "lucide-react"

const PAGE_SIZE = 10

export function ApartmentReviewsManager({
  apartmentId,
}: {
  apartmentId: string
}) {
  const t = useTranslations("apartmentManage.reviews")
  const searchParams = useSearchParams()

  const responseStatus = getReviewResponseTab(
    searchParams.get("filter") ?? undefined
  )
  const rating = getReviewRatingFilter(searchParams.get("rating") ?? undefined)
  const sortOrder = getReviewSortOrder(searchParams.get("sort") ?? undefined)
  const page = Number(searchParams.get("page")) || 1

  const { data, isPending, isPlaceholderData, isError, refetch } =
    useApartmentReviews(apartmentId, {
      responseStatus,
      rating,
      sortOrder,
      page,
      pageSize: PAGE_SIZE,
    })

  const showSkeleton = isPending || isPlaceholderData
  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
        <h1 className="text-lg font-semibold text-foreground">
          {t("pageTitle")}
        </h1>
        <p className="text-sm text-foreground/70">{t("pageDescription")}</p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          ariaLabel={t("filterLabel")}
          defaultValue={DEFAULT_REVIEW_RESPONSE_TAB}
          options={REVIEW_RESPONSE_TABS.map((value) => ({
            value,
            label: t(`tabs.${value}`),
          }))}
        />
        <div className="flex items-center gap-2">
          <SortSelect
            label={t("ratingFilterLabel")}
            paramName="rating"
            defaultValue={DEFAULT_REVIEW_RATING_FILTER}
            options={REVIEW_RATING_FILTERS.map((value) => ({
              value,
              label: t(`ratingFilters.${value}`),
            }))}
          />
          <SortSelect
            label={t("sortLabel")}
            paramName="sort"
            defaultValue={DEFAULT_REVIEW_SORT_ORDER}
            options={REVIEW_SORT_ORDERS.map((value) => ({
              value,
              label: t(`sorts.${value}`),
            }))}
          />
        </div>
      </div>

      {showSkeleton ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
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
          <div className="flex flex-col gap-5">
            {items.map((review) => (
              <ApartmentReviewCard
                key={review.id}
                apartmentId={apartmentId}
                review={review}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
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
