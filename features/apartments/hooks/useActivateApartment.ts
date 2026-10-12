"use client"

import { useTranslations } from "next-intl"

import { activateApartment } from "@/features/apartments/api/apartments"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useActivateApartment() {
  const t = useTranslations("myApartments")
  return useApiMutation({
    mutationFn: activateApartment,
    successMessage: t("activatedToast"),
    invalidate: [queryKeys.apartments.all],
  })
}
