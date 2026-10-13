"use client"

import { queryKeys } from "@/lib/query/query-keys"
import { useQuery } from "@tanstack/react-query"
import { getApartmentAmenities } from "../api/apartment-amenities"

export function useApartmentAmentities(apartmentId: string) {
  return useQuery({
    queryKey: queryKeys.apartments.amenity(apartmentId),
    queryFn: () => getApartmentAmenities(apartmentId),
  })
}
