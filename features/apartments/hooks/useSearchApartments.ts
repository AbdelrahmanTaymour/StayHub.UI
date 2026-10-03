"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { searchApartments } from "@/features/apartments/api/apartments"
import {
  filtersToApiQuery,
  type ApartmentSearchFilters,
} from "@/features/apartments/utils/search-params"

export function useSearchApartments(filters: ApartmentSearchFilters) {
  const query = filtersToApiQuery(filters)

  return useQuery({
    queryKey: ["apartments", "search", query],
    queryFn: () => searchApartments(query),
    placeholderData: keepPreviousData,
  })
}
