"use client"

import { useQuery } from "@tanstack/react-query"

import { getApartmentForEdit } from "@/features/apartments/api/apartments"
import { queryKeys } from "@/lib/query/query-keys"

export function useApartmentForEdit(apartmentId: string) {
  return useQuery({
    queryKey: queryKeys.apartments.forEdit(apartmentId),
    queryFn: () => getApartmentForEdit(apartmentId),
  })
}
