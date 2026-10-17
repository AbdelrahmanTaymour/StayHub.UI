// features/bookings/hooks/useRejectBooking.ts
"use client"

import { useTranslations } from "next-intl"

import { rejectBooking } from "@/features/bookings/api/bookings"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useRejectBooking(apartmentId: string) {
  const t = useTranslations("apartmentManage.bookings")
  return useApiMutation({
    mutationFn: rejectBooking,
    successMessage: t("rejectedToast"),
    invalidate: [queryKeys.bookings.byApartment(apartmentId)],
    errorMessage: t("rejectErrorToast"),
  })
}
