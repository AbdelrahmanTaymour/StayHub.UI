"use client"

import { useQuery } from "@tanstack/react-query"

import { getApartmentImages } from "@/features/apartments/api/apartment-images"
import { queryKeys } from "@/lib/query/query-keys"

export function useApartmentImages(apartmentId: string) {
  return useQuery({
    queryKey: queryKeys.apartments.images(apartmentId),
    queryFn: () => getApartmentImages(apartmentId),
    select: (data) => data.photos ?? [],
  })
}
