"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { CalendarX } from "lucide-react"

import { Pagination } from "@/components/common/Pagination"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useMyBookings } from "@/features/bookings/hooks/useMyBookings"
import {
  getBookingFilter,
  sortBookings,
  type BookingSort,
} from "@/features/bookings/utils/booking-filters"
import { BookingCard } from "./BookingCard"
import { BookingSortSelect } from "./BookingSortSelect"
import { BookingStatusTabs } from "./BookingStatusTabs"
import { BookingsListSkeleton } from "./BookingsListSkeleton"

const PAGE_SIZE = 10

export function BookingsList() {
  const t = useTranslations("bookings")
  const searchParams = useSearchParams()
  const filter = getBookingFilter(searchParams.get("filter") ?? undefined)

  const sort = (searchParams.get("sort") as BookingSort) || "stayNewest"
  const page = Number(searchParams.get("page")) || 1

  const { data, isPending, isPlaceholderData, isError, refetch } =
    useMyBookings({
      filter,
      page,
      pageSize: PAGE_SIZE,
    })

  const showSkeleton = isPending || isPlaceholderData
  const items = sortBookings(data?.items ?? [], sort)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <BookingStatusTabs />
        <BookingSortSelect />
      </div>

      {showSkeleton ? (
        <BookingsListSkeleton />
      ) : isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("retry")}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="size-10" />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              {t("browseStays")}
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {items.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isPriority={index === 0}
              />
            ))}
          </div>

          <Pagination
            page={data?.page ?? page}
            totalPages={data?.totalPages ?? 1}
          />
        </>
      )}
    </div>
  )
}
