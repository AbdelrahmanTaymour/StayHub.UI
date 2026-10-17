import {
  ReviewRatingFilter,
  ReviewResponseStatusFilter,
  ReviewSortOrder,
} from "@/lib/api/types/reviews"

export const REVIEW_RESPONSE_TABS = [
  "All",
  "NeedsResponse",
  "Responded",
] as const satisfies readonly ReviewResponseStatusFilter[]
export const DEFAULT_REVIEW_RESPONSE_TAB: ReviewResponseStatusFilter = "All"

export const REVIEW_RATING_FILTERS = [
  "All",
  "FiveStars",
  "FourStars",
  "ThreeStarsOrLess",
] as const satisfies readonly ReviewRatingFilter[]
export const DEFAULT_REVIEW_RATING_FILTER: ReviewRatingFilter = "All"

export const REVIEW_SORT_ORDERS = [
  "Recent",
  "Oldest",
  "RatingDesc",
  "RatingAsc",
] as const satisfies readonly ReviewSortOrder[]
export const DEFAULT_REVIEW_SORT_ORDER: ReviewSortOrder = "Recent"

export function getReviewResponseTab(
  value: string | undefined
): ReviewResponseStatusFilter {
  return (
    REVIEW_RESPONSE_TABS.find((v) => v === value) ?? DEFAULT_REVIEW_RESPONSE_TAB
  )
}
export function getReviewRatingFilter(
  value: string | undefined
): ReviewRatingFilter {
  return (
    REVIEW_RATING_FILTERS.find((v) => v === value) ??
    DEFAULT_REVIEW_RATING_FILTER
  )
}
export function getReviewSortOrder(value: string | undefined): ReviewSortOrder {
  return (
    REVIEW_SORT_ORDERS.find((v) => v === value) ?? DEFAULT_REVIEW_SORT_ORDER
  )
}
