import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type ReviewResponse =
  Schemas["StayHub.Application.Reviews.GetReview.ReviewResponse"]

export type ApartmentReviewResponse =
  Schemas["StayHub.Application.Reviews.GetApartmentReviews.ApartmentReviewResponse"]

export type ReviewRatingFilter =
  Schemas["StayHub.Application.Reviews.GetApartmentReviews.ReviewRatingFilter"]

export type ReviewResponseStatusFilter =
  Schemas["StayHub.Application.Reviews.GetApartmentReviews.ReviewResponseStatusFilter"]

export type ReviewSortOrder =
  Schemas["StayHub.Application.Reviews.GetApartmentReviews.ReviewSortOrder"]

export type CreateReviewRequest =
  Schemas["StayHub.Api.Endpoints.Reviews.CreateReviewRequest"]

export type CreateReviewResponseRequest =
  Schemas["StayHub.Api.Endpoints.Reviews.CreateReviewResponseRequest"]
