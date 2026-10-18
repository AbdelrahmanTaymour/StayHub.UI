"use client"

import { useQuery } from "@tanstack/react-query"

import { getApartmentBookings } from "@/features/bookings/api/bookings"
import { queryKeys } from "@/lib/query/query-keys"
import type { QueryParameters } from "@/lib/api/type-utils"

type ApartmentBookingsQuery = QueryParameters<
  "/api/v1/bookings/{apartmentId}/bookings",
  "get"
>

export function useApartmentBookings(
  apartmentId: string,
  query: ApartmentBookingsQuery
) {
  return useQuery({
    queryKey: queryKeys.bookings.byApartmentList(
      apartmentId,
      query.status,
      query.sort,
      query.page
    ),
    queryFn: () => getApartmentBookings(apartmentId, query),
  })
}
