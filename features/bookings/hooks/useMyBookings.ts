"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getMyBookings } from "@/features/bookings/api/bookings"
import { queryKeys } from "@/lib/query/query-keys"
import type { QueryParameters } from "@/lib/api/type-utils"

type MyBookingsQuery = QueryParameters<"/api/v1/bookings/mine", "get">

export function useMyBookings(query: MyBookingsQuery) {
  return useQuery({
    queryKey: queryKeys.bookings.mine(query.filter, query.page),
    queryFn: () => getMyBookings(query),
    placeholderData: keepPreviousData,
  })
}
