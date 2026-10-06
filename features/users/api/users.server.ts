import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { ApiError, unwrap } from "@/lib/errors/api-error"

/** Public owner profile for the server render. Returns null when the owner doesn't exist. */
export const getOwnerProfileServer = cache(async (ownerId: string) => {
  try {
    return await unwrap(
      await apiClient.GET("/api/v1/users/{ownerId}/profile", {
        params: { path: { ownerId } },
      })
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})
