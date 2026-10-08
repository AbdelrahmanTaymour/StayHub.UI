"use client"

import { useTranslations } from "next-intl"

import { cancelBooking } from "@/features/bookings/api/bookings"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useCancelBooking(bookingId: string) {
  const t = useTranslations("bookings")

  return useApiMutation({
    mutationFn: () => cancelBooking(bookingId),
    successMessage: t("cancelledToast"),
    invalidate: [queryKeys.bookings.all],
  })
}
