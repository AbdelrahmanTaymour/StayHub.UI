import type { QueryParameters } from "@/lib/api/type-utils"

type MyBookingsQuery = QueryParameters<"/api/v1/bookings/mine", "get">
export type MyBookingsFilter = NonNullable<MyBookingsQuery["filter"]>

export const BOOKING_TABS = [
  "All",
  "Upcoming",
  "Completed",
  "Cancelled",
] as const satisfies readonly MyBookingsFilter[]

export const DEFAULT_BOOKING_TAB: MyBookingsFilter = "All"

export function getBookingFilter(value: string | undefined): MyBookingsFilter {
  const match = BOOKING_TABS.find((tab) => tab === value)
  return match ?? DEFAULT_BOOKING_TAB
}

/**
 * Client-side only. `GetMyBookingsQuery` has no `sort` parameter in the
 * generated types (only filter/page/pageSize), so this reorders the current
 * page's items rather than the whole result set. If cross-page sorting is
 * needed, the backend needs a sort parameter first — don't fake it here.
 */
export type BookingSort = "stayNewest" | "stayOldest" | "priceDesc" | "priceAsc"

export const BOOKING_SORT_OPTIONS: readonly BookingSort[] = [
  "stayNewest",
  "stayOldest",
  "priceDesc",
  "priceAsc",
]

export function sortBookings<
  T extends { durationStart?: string; totalPriceAmount?: number },
>(items: T[], sort: BookingSort): T[] {
  const sorted = [...items]

  switch (sort) {
    case "stayNewest":
      return sorted.sort((a, b) =>
        (b.durationStart ?? "").localeCompare(a.durationStart ?? "")
      )
    case "stayOldest":
      return sorted.sort((a, b) =>
        (a.durationStart ?? "").localeCompare(b.durationStart ?? "")
      )
    case "priceDesc":
      return sorted.sort(
        (a, b) => (b.totalPriceAmount ?? 0) - (a.totalPriceAmount ?? 0)
      )
    case "priceAsc":
      return sorted.sort(
        (a, b) => (a.totalPriceAmount ?? 0) - (b.totalPriceAmount ?? 0)
      )
  }
}
