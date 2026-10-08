import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { ApiError, unwrap } from "@/lib/errors/api-error"
import type { QueryParameters } from "@/lib/api/type-utils"

type MyBookingsQuery = QueryParameters<"/api/v1/bookings/mine", "get">

/** Server-rendered first page of the signed-in user's own bookings. */
export const getMyBookingsServer = cache(async (query?: MyBookingsQuery) =>
  unwrap(
    await apiClient.GET("/api/v1/bookings/mine", {
      params: { query },
    })
  )
)

/**
 * Single booking for the detail page. Per spec §7.6, the backend returns 404
 * both when the booking doesn't exist and when the caller isn't its guest,
 * owner, or admin — on purpose, to avoid confirming the booking's existence
 * to someone who shouldn't see it. This function can't and shouldn't try to
 * tell those two cases apart; the caller renders one generic "not found" UI.
 */
export const getBookingServer = cache(async (id: string) => {
  try {
    return await unwrap(
      await apiClient.GET("/api/v1/bookings/{id}", {
        params: { path: { id } },
      })
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})
