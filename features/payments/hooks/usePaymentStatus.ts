"use client"

import { useQuery } from "@tanstack/react-query"

import { getPaymentByBooking } from "@/features/payments/api/payments"
import { queryKeys } from "@/lib/query/query-keys"

const POLL_INTERVAL_MS = 2000

export function usePaymentStatus(bookingId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.payments.byBooking(bookingId),
    queryFn: () => getPaymentByBooking(bookingId),
    enabled,
    refetchInterval: (query) =>
      query.state.data?.status === "Pending" ? POLL_INTERVAL_MS : false,
  })
}
