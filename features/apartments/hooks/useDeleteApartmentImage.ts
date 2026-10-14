"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { deleteApartmentImage } from "@/features/apartments/api/apartment-images"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { ApartmentImageResponse } from "@/lib/api/types/apartments"

type ImagesResponse = {
  photos?: ApartmentImageResponse[] | null
}

export function useDeleteApartmentImage(apartmentId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("apartmentManage.images")
  const key = queryKeys.apartments.images(apartmentId)

  return useApiMutation<void, string, ImagesResponse | undefined>({
    mutationFn: deleteApartmentImage,
    onMutate: async (imageId) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<ImagesResponse>(key)
      queryClient.setQueryData<ImagesResponse>(key, (data) =>
        data
          ? {
              ...data,
              photos: (data.photos ?? []).filter((p) => p.id !== imageId),
            }
          : data
      )
      return previous
    },
    onError: (_err, _id, previous) => {
      if (previous) queryClient.setQueryData(key, previous)
    },
    invalidate: [queryKeys.apartments.all],
    errorMessage: t("deleteErrorToast"),
  })
}
