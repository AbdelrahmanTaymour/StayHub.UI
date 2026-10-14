"use client"

import { useTranslations } from "next-intl"

import { reorderApartmentImages } from "@/features/apartments/api/apartment-images"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useReorderApartmentImages(apartmentId: string) {
  const t = useTranslations("apartmentManage.images")

  return useApiMutation<void, string[]>({
    mutationFn: (orderedImageIds) =>
      reorderApartmentImages(apartmentId, { orderedImageIds }),
    invalidate: [queryKeys.apartments.images(apartmentId)],
    errorMessage: t("reorderErrorToast"),
  })
}
