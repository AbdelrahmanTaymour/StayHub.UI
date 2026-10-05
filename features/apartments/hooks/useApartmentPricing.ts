"use client"

import { useQuery } from "@tanstack/react-query"

import { getApartmentPricing } from "@/features/apartments/api/apartments"
import type { StayRange } from "@/features/apartments/utils/stay-range"
import { queryKeys } from "@/lib/query/query-keys"

export function useApartmentPricing(
  apartmentId: string,
  stay: StayRange | null
) {
  const startDate = stay?.startDate ?? ""
  const endDate = stay?.endDate ?? ""

  return useQuery({
    queryKey: queryKeys.apartments.pricing(apartmentId, startDate, endDate),
    queryFn: () => getApartmentPricing(apartmentId, startDate, endDate),
    enabled: startDate !== "" && endDate !== "",
  })
}
