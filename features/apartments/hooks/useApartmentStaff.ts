"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query/query-keys"
import { ApartmentStaffResponse } from "@/lib/api/types/apartments"
import { getApartmentStaff } from "@/features/apartments/api/apartment-staff"

export function useApartmentStaff(
  apartmentId: string,
  initialData: ApartmentStaffResponse[]
) {
  return useQuery({
    queryKey: queryKeys.apartments.staff(apartmentId),
    queryFn: () => getApartmentStaff(apartmentId),
    initialData,
  })
}
