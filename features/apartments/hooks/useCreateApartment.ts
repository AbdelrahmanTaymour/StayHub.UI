"use client"

import { useTranslations } from "next-intl"

import { createApartment } from "@/features/apartments/api/apartments"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useCreateApartment() {
  const t = useTranslations("myApartments.createSheet")
  return useApiMutation({
    mutationFn: createApartment,
    successMessage: t("createdToast"),
    invalidate: [queryKeys.apartments.all],
  })
}
