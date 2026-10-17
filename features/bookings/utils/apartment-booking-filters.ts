import {
  ApartmentBookingsFilter,
  ApartmentBookingsSort,
} from "@/lib/api/types/bookings"

export const APARTMENT_BOOKING_TABS = [
  "All",
  "Pending",
  "Confirmed",
  "Cancelled",
  "Rejected",
] as const satisfies readonly ApartmentBookingsFilter[]
export const DEFAULT_APARTMENT_BOOKING_TAB: ApartmentBookingsFilter = "All"

export function getApartmentBookingFilter(
  value: string | undefined
): ApartmentBookingsFilter {
  return (
    APARTMENT_BOOKING_TABS.find((tab) => tab === value) ??
    DEFAULT_APARTMENT_BOOKING_TAB
  )
}

export const APARTMENT_BOOKING_SORTS = [
  "CheckInAsc",
  "CheckInDesc",
  "TotalDesc",
  "TotalAsc",
] as const satisfies readonly ApartmentBookingsSort[]
export const DEFAULT_APARTMENT_BOOKING_SORT: ApartmentBookingsSort =
  "CheckInAsc"

export function getApartmentBookingSort(
  value: string | undefined
): ApartmentBookingsSort {
  return (
    APARTMENT_BOOKING_SORTS.find((s) => s === value) ??
    DEFAULT_APARTMENT_BOOKING_SORT
  )
}
