import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { ApiError, unwrap } from "@/lib/errors/api-error"

/**
 * Server-side fetch for the details page. Wrapped in React `cache` so
 * `generateMetadata` and the page share one request. `getApartment` in
 * apartments.ts uses the browser client, so it can't run in Server Components.
 */
export const getApartmentDetailsServer = cache(async (apartmentId: string) => {
  try {
    return await unwrap(
      await apiClient.GET("/api/v1/apartments/{id}", {
        params: { path: { id: apartmentId } },
      })
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})
