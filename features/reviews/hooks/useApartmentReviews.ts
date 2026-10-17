"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getApartmentReviews } from "@/features/reviews/api/reviews"
import { queryKeys } from "@/lib/query/query-keys"
import { ApartmentReviewsQuery } from "@/lib/api/types/reviews"

export function useApartmentReviews(
  apartmentId: string,
  query: ApartmentReviewsQuery
) {
  return useQuery({
    queryKey: queryKeys.reviews.byApartment(
      apartmentId,
      query.responseStatus,
      query.rating,
      query.sortOrder,
      query.page
    ),
    queryFn: () => getApartmentReviews(apartmentId, query),
    placeholderData: keepPreviousData,
  })
}
