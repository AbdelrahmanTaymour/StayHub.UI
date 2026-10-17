// features/bookings/hooks/useConfirmBooking.ts
"use client"

import { useTranslations } from "next-intl"

import { confirmBooking } from "@/features/bookings/api/bookings"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useConfirmBooking(apartmentId: string) {
  const t = useTranslations("apartmentManage.bookings")
  return useApiMutation({
    mutationFn: confirmBooking,
    successMessage: t("confirmedToast"),
    invalidate: [queryKeys.bookings.byApartment(apartmentId)],
    errorMessage: t("confirmErrorToast"),
  })
}
