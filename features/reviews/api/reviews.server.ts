import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { unwrap } from "@/lib/errors/api-error"
import { ApartmentReviewsQuery } from "@/lib/api/types/reviews"

export const getApartmentReviewsServer = cache(
  async (apartmentId: string, query?: ApartmentReviewsQuery) =>
    unwrap(
      await apiClient.GET("/api/v1/reviews/by-apartment/{apartmentId}", {
        params: { path: { apartmentId }, query },
      })
    )
)
