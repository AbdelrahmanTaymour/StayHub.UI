"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getMyApartments } from "@/features/apartments/api/apartments"
import { queryKeys } from "@/lib/query/query-keys"
import type { QueryParameters } from "@/lib/api/type-utils"

type MyApartmentsQuery = QueryParameters<"/api/v1/apartments/mine", "get">

export function useMyApartments(query: MyApartmentsQuery) {
  return useQuery({
    queryKey: queryKeys.apartments.mineList(
      query.status,
      query.search,
      query.page
    ),
    queryFn: () => getMyApartments(query),
    placeholderData: keepPreviousData,
  })
}
