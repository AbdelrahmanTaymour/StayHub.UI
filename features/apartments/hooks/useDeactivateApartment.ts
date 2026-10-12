"use client"

import { useTranslations } from "next-intl"

import { deactivateApartment } from "@/features/apartments/api/apartments"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useDeactivateApartment() {
  const t = useTranslations("myApartments")
  return useApiMutation({
    mutationFn: deactivateApartment,
    successMessage: t("deactivatedToast"),
    invalidate: [queryKeys.apartments.all],
  })
}
