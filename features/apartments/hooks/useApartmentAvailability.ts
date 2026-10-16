"use client"

import { useQuery } from "@tanstack/react-query"

import { getApartmentAvailabilityBlocks } from "@/features/apartments/api/apartment-availability"
import { queryKeys } from "@/lib/query/query-keys"

export function useApartmentAvailability(apartmentId: string) {
  return useQuery({
    queryKey: queryKeys.apartments.availability(apartmentId),
    queryFn: () => getApartmentAvailabilityBlocks(apartmentId),
  })
}
