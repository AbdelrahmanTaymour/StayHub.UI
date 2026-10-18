"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { activateApartment } from "@/features/apartments/api/apartments"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

type EditableApartment = { isActive?: boolean }

export function useActivateApartment(apartmentId?: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("myApartments")

  return useApiMutation({
    mutationFn: activateApartment,
    successMessage: t("activatedToast"),
    onMutate: async () => {
      if (!apartmentId) return
      await queryClient.cancelQueries({
        queryKey: queryKeys.apartments.forEdit(apartmentId),
      })
      const previous = queryClient.getQueryData<EditableApartment>(
        queryKeys.apartments.forEdit(apartmentId)
      )
      queryClient.setQueryData<EditableApartment>(
        queryKeys.apartments.forEdit(apartmentId),
        (data) => (data ? { ...data, isActive: true } : data)
      )
      return previous
    },
    onError: (_err, _id, previous) => {
      if (apartmentId)
        queryClient.setQueryData(
          queryKeys.apartments.forEdit(apartmentId),
          previous
        )
    },
    invalidate: [queryKeys.apartments.mine()],
  })
}
