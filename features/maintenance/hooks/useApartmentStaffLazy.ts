"use client"

import { useQuery } from "@tanstack/react-query"

import { getApartmentStaff } from "@/features/apartments/api/apartment-staff"
import { queryKeys } from "@/lib/query/query-keys"

export function useApartmentStaffLazy(apartmentId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.apartments.staff(apartmentId),
    queryFn: () => getApartmentStaff(apartmentId),
    enabled,
  })
}
