"use client"

import { useTranslations } from "next-intl"

import { reserveBooking } from "@/features/bookings/api/bookings"
import { useRouter } from "@/i18n/navigation"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useReserveBooking() {
  const t = useTranslations("apartmentDetails.booking")
  const router = useRouter()

  return useApiMutation({
    mutationFn: reserveBooking,
    successMessage: t("reservedToast"),
    invalidate: [queryKeys.bookings.all],
    onSuccess: (bookingId) => {
      router.push(`/bookings/${bookingId}`)
    },
  })
}
