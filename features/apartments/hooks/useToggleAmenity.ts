"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import {
  addApartmentAmenity,
  removeApartmentAmenity,
} from "@/features/apartments/api/apartment-amenities"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { Amenity, ApartmentAmenitiesResponse } from "@/lib/api/types/apartments"

export function useToggleAmenity(apartmentId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("apartmentManage.amenities")
  const detailKey = queryKeys.apartments.amenity(apartmentId)

  return useApiMutation<
    void,
    { amenity: Amenity; enabled: boolean },
    string[] | null | undefined
  >({
    mutationFn: ({ amenity, enabled }) =>
      enabled
        ? addApartmentAmenity(apartmentId, { amenity })
        : removeApartmentAmenity(apartmentId, amenity),

    onMutate: async ({ amenity, enabled }) => {
      await queryClient.cancelQueries({ queryKey: detailKey })
      const previous =
        queryClient.getQueryData<ApartmentAmenitiesResponse>(
          detailKey
        )?.amenities

      queryClient.setQueryData<ApartmentAmenitiesResponse>(
        detailKey,
        (data) => {
          if (!data) return data
          const current = data.amenities ?? []
          const next = enabled
            ? current.includes(amenity)
              ? current
              : [...current, amenity]
            : current.filter((item) => item !== amenity)
          return { ...data, amenities: next }
        }
      )

      return previous
    },
    successMessage(_, variables) {
      return variables.enabled
        ? t("AddedToast", { amenity: variables.amenity })
        : t("RemovedToast", { amenity: variables.amenity })
    },
    onError: (_err, _vars, previous) => {
      queryClient.setQueryData<ApartmentAmenitiesResponse>(detailKey, (data) =>
        data ? { ...data, amenities: previous } : data
      )
    },

    invalidate: [queryKeys.apartments.all],
    errorMessage: t("updateErrorToast"),
  })
}
