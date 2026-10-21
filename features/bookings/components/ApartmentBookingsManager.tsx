"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { FilterTabs } from "@/components/common/FilterTabs"
import { SortSelect } from "@/components/common/SortSelect"
import { Pagination } from "@/components/common/Pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/feedback/ErrorState"
import { useApartmentBookings } from "@/features/bookings/hooks/useApartmentBookings"
import {
  APARTMENT_BOOKING_SORTS,
  APARTMENT_BOOKING_TABS,
  DEFAULT_APARTMENT_BOOKING_SORT,
  DEFAULT_APARTMENT_BOOKING_TAB,
  getApartmentBookingFilter,
  getApartmentBookingSort,
} from "@/features/bookings/utils/apartment-booking-filters"
import { getOverlappingBookingIds } from "@/features/bookings/utils/apartment-booking-overlaps"
import { ApartmentBookingsTable } from "./ApartmentBookingsTable"

const PAGE_SIZE = 10

export function ApartmentBookingsManager({
  apartmentId,
}: {
  apartmentId: string
}) {
  const t = useTranslations("apartmentManage.bookings")
  const searchParams = useSearchParams()

  const status = getApartmentBookingFilter(
    searchParams.get("status") ?? undefined
  )
  const sort = getApartmentBookingSort(searchParams.get("sort") ?? undefined)
  const page = Number(searchParams.get("page")) || 1

  const { data, isPending, isPlaceholderData, isError, refetch } =
    useApartmentBookings(apartmentId, {
      status,
      sort,
      page,
      pageSize: PAGE_SIZE,
    })

  const showSkeleton = isPending || isPlaceholderData
  const items = data?.items ?? []
  const overlapCounts = getOverlappingBookingIds(items)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          ariaLabel={t("filterLabel")}
          defaultValue={DEFAULT_APARTMENT_BOOKING_TAB}
          options={APARTMENT_BOOKING_TABS.map((value) => ({
            value,
            label: t(`tabs.${value}`),
          }))}
        />
        <SortSelect
          label={t("sortLabel")}
          defaultValue={DEFAULT_APARTMENT_BOOKING_SORT}
          options={APARTMENT_BOOKING_SORTS.map((value) => ({
            value,
            label: t(`sorts.${value}`),
          }))}
        />
      </div>

      {showSkeleton ? (
        <ApartmentBookingsTableSkeleton />
      ) : isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("retry")}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <ApartmentBookingsTable
            apartmentId={apartmentId}
            bookings={items}
            overlapCounts={overlapCounts}
          />
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

function ApartmentBookingsTableSkeleton() {
  return (
    <div
      role="status"
      className="overflow-hidden rounded-xl border border-border"
    >
      <span className="sr-only">Loading bookings…</span>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border p-4 last:border-0"
        >
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-24 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
