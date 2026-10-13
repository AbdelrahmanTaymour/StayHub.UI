"use client"

import { useTranslations } from "next-intl"

import { updateApartment } from "@/features/apartments/api/apartments"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

interface UpdateApartmentVariables {
  id: string
  body: Parameters<typeof updateApartment>[1]
}

export function useUpdateApartment() {
  const t = useTranslations("apartmentManage")

  return useApiMutation<void, UpdateApartmentVariables>({
    mutationFn: ({ id, body }) => updateApartment(id, body),
    successMessage: t("savedToast"),
    invalidate: [queryKeys.apartments.all],
  })
}
