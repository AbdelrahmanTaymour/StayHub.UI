import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { QueryParameters } from "@/lib/api/type-utils"
import {
  CreateReviewRequest,
  CreateReviewResponseRequest,
} from "@/lib/api/types/reviews"

type ApartmentReviewsQuery = QueryParameters<
  "/api/v1/reviews/by-apartment/{apartmentId}",
  "get"
>

export async function getReview(id: string) {
  return unwrap(
    await apiClient.GET("/api/v1/reviews/{id}", {
      params: { path: { id } },
    })
  )
}

export async function getApartmentReviews(
  apartmentId: string,
  query?: ApartmentReviewsQuery
) {
  return unwrap(
    await apiClient.GET("/api/v1/reviews/by-apartment/{apartmentId}", {
      params: { path: { apartmentId }, query },
    })
  )
}

export async function createReview(body: CreateReviewRequest) {
  return unwrap(await apiClient.POST("/api/v1/reviews", { body }))
}

export async function respondToReview(
  reviewId: string,
  body: CreateReviewResponseRequest
) {
  return unwrap(
    await apiClient.POST("/api/v1/reviews/{reviewId}/response", {
      params: { path: { reviewId } },
      body,
    })
  )
}

/*
type CreateReviewRequest = {
    bookingId?: string; // uuid
    rating?: number; // int32
    comment?: string | null;
}

type CreateReviewResponseRequest = {
    comment?: string | null;
}

type ApartmentReviewsQuery = {
    responseStatus?: ReviewResponseStatusFilter; // filter by whether the host has responded
    rating?: ReviewRatingFilter; // filter by star rating bucket
    sortOrder?: ReviewSortOrder; // sort order applied to the result list
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}
type ReviewResponseStatusFilter = "All" | "NeedsResponse" | "Responded"
// All: every review · NeedsResponse: host hasn't replied yet · Responded: host has replied

type ReviewRatingFilter = "All" | "FiveStars" | "FourStars" | "ThreeStarsOrLess"
// All: every rating · FiveStars / FourStars: exactly that rating
// ThreeStarsOrLess: 3 stars and below

type ReviewSortOrder = "Recent" | "Oldest" | "RatingDesc" | "RatingAsc"
// Recent/Oldest: order by creation date, newest/oldest first
// RatingDesc/RatingAsc: order by rating, highest/lowest first

// Responses

type GetReviewResponse = ReviewResponse
type ReviewResponse = {
    id?: string; // uuid
    apartmentId?: string; // uuid
    bookingId?: string; // uuid
    userId?: string; // uuid
    rating?: number; // int32
    comment?: string | null;
    createdOnUtc?: string; // date-time
    ownerResponseComment?: string | null;
}

type GetApartmentReviewsResponse = PagedResponse<ApartmentReviewResponse>
type ApartmentReviewResponse = {
    id?: string; // uuid
    reviewerName?: string | null;
    reviewerAvatarUrl?: string | null;
    nightsStayed?: number; // int32
    rating?: number; // int32
    comment?: string | null;
    createdOnUtc?: string; // date-time
    ownerResponseComment?: string | null;
    ownerResponseCreatedOnUtc?: string | null; // date-time
}
type PagedResponse<T> = {
    items: T[] | null;
    page?: number; // int32
    pageSize?: number; // int32
    totalCount?: number; // int32
    totalPages?: number; // int32
}

type CreateReviewResponse = string // new review id (uuid)
type RespondToReviewResponse = string // new response id (uuid)
*/
