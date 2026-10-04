"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { searchApartments } from "@/features/apartments/api/apartments"
import {
  filtersToApiQuery,
  type ApartmentSearchFilters,
} from "@/features/apartments/utils/search-params"
import { queryKeys } from "@/lib/query/query-keys"

export function useSearchApartments(filters: ApartmentSearchFilters) {
  const query = filtersToApiQuery(filters)

  return useQuery({
    queryKey: queryKeys.apartments.searchList(query),
    queryFn: () => searchApartments(query),
    placeholderData: keepPreviousData,
  })
}
