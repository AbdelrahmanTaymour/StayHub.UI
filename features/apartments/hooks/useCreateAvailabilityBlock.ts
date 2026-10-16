"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { createApartmentAvailabilityBlock } from "@/features/apartments/api/apartment-availability"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { ApartmentAvailabilityResponse } from "@/lib/api/types/apartments"

type Body = Parameters<typeof createApartmentAvailabilityBlock>[1]

export function useCreateAvailabilityBlock(apartmentId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("apartmentManage.availability")
  const key = queryKeys.apartments.availability(apartmentId)

  return useApiMutation<
    string,
    Body,
    ApartmentAvailabilityResponse | undefined
  >({
    mutationFn: (body) => createApartmentAvailabilityBlock(apartmentId, body),
    successMessage: t("blockCreatedToast"),

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous =
        queryClient.getQueryData<ApartmentAvailabilityResponse>(key)

      queryClient.setQueryData<ApartmentAvailabilityResponse>(key, (data) => {
        if (!data) return data
        const optimisticBlock = {
          id: `optimistic-${Date.now()}`,
          startDate: body.start,
          endDate: body.end,
          reason: body.reason,
        }
        return { ...data, blocks: [...(data.blocks ?? []), optimisticBlock] }
      })

      return previous
    },

    onError: (_err, _body, previous) => {
      if (previous) queryClient.setQueryData(key, previous)
    },

    invalidate: [key],
    errorMessage: t("createErrorToast"),
  })
}
