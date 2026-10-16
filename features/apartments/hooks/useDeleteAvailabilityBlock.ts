"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { deleteApartmentAvailabilityBlock } from "@/features/apartments/api/apartment-availability"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { ApartmentAvailabilityResponse } from "@/lib/api/types/apartments"

export function useDeleteAvailabilityBlock(apartmentId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("apartmentManage.availability")
  const key = queryKeys.apartments.availability(apartmentId)

  return useApiMutation<
    void,
    string,
    ApartmentAvailabilityResponse | undefined
  >({
    mutationFn: deleteApartmentAvailabilityBlock,
    successMessage: t("blockRemovedToast"),

    onMutate: async (blockId) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous =
        queryClient.getQueryData<ApartmentAvailabilityResponse>(key)

      queryClient.setQueryData<ApartmentAvailabilityResponse>(key, (data) =>
        data
          ? {
              ...data,
              blocks: (data.blocks ?? []).filter((b) => b.id !== blockId),
            }
          : data
      )

      return previous
    },

    onError: (_err, _id, previous) => {
      if (previous) queryClient.setQueryData(key, previous)
    },

    invalidate: [key],
    errorMessage: t("deleteErrorToast"),
  })
}
