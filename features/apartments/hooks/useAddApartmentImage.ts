"use client"

import { useTranslations } from "next-intl"

import {
  addApartmentImage,
  type AddApartmentImageInput,
} from "@/features/apartments/api/apartment-images"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useAddApartmentImage(apartmentId: string) {
  const t = useTranslations("apartmentManage.images")

  return useApiMutation<string, AddApartmentImageInput>({
    mutationFn: ({ file, isPrimary }) =>
      addApartmentImage(apartmentId, { file, isPrimary }),
    invalidate: [
      queryKeys.apartments.images(apartmentId),
      queryKeys.apartments.all,
    ],
    errorMessage: t("uploadErrorToast"),
  })
}
