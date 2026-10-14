"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { setPrimaryApartmentImage } from "@/features/apartments/api/apartment-images"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { ApartmentImageResponse } from "@/lib/api/types/apartments"

type ImagesResponse = {
  photos?: ApartmentImageResponse[] | null
}

export function useSetPrimaryApartmentImage(apartmentId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("apartmentManage.images")
  const key = queryKeys.apartments.images(apartmentId)

  return useApiMutation<void, string, ImagesResponse | undefined>({
    mutationFn: (imageId) => setPrimaryApartmentImage(apartmentId, imageId),
    onMutate: async (imageId) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<ImagesResponse>(key)
      queryClient.setQueryData<ImagesResponse>(key, (data) =>
        data
          ? {
              ...data,
              photos: (data.photos ?? []).map((p) => ({
                ...p,
                isPrimary: p.id === imageId,
              })),
            }
          : data
      )
      return previous
    },
    onError: (_err, _id, previous) => {
      if (previous) queryClient.setQueryData(key, previous)
    },
    invalidate: [queryKeys.apartments.all],
    errorMessage: t("primaryErrorToast"),
  })
}
