import type { QueryParameters } from "@/lib/api/type-utils"

type Query = QueryParameters<
  "/api/v1/reviews/by-apartment/{apartmentId}",
  "get"
>

export type PublicReviewRatingFilter = NonNullable<Query["rating"]>
export type PublicReviewSortOrder = NonNullable<Query["sortOrder"]>

export const PUBLIC_REVIEW_RATING_FILTERS = [
  "All",
  "FiveStars",
  "FourStars",
  "ThreeStarsOrLess",
] as const satisfies readonly PublicReviewRatingFilter[]
export const DEFAULT_PUBLIC_REVIEW_RATING: PublicReviewRatingFilter = "All"

export const PUBLIC_REVIEW_SORT_ORDERS = [
  "Recent",
  "Oldest",
  "RatingDesc",
  "RatingAsc",
] as const satisfies readonly PublicReviewSortOrder[]
export const DEFAULT_PUBLIC_REVIEW_SORT: PublicReviewSortOrder = "Recent"

export function getPublicReviewRating(
  value: string | undefined
): PublicReviewRatingFilter {
  return (
    PUBLIC_REVIEW_RATING_FILTERS.find((v) => v === value) ??
    DEFAULT_PUBLIC_REVIEW_RATING
  )
}
export function getPublicReviewSort(
  value: string | undefined
): PublicReviewSortOrder {
  return (
    PUBLIC_REVIEW_SORT_ORDERS.find((v) => v === value) ??
    DEFAULT_PUBLIC_REVIEW_SORT
  )
}
