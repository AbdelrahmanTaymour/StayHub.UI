import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { ApiError, unwrap } from "@/lib/errors/api-error"
import { QueryParameters } from "@/lib/api/type-utils"

/**
 * Server-side fetch for the details page. Wrapped in React `cache` so
 * `generateMetadata` and the page share one request. `getApartment` in
 * apartments.ts uses the browser client, so it can't run in Server Components.
 */
export const getApartmentDetailsServer = cache(async (apartmentId: string) => {
  try {
    const apartment = await unwrap(
      await apiClient.GET("/api/v1/apartments/{id}", {
        params: { path: { id: apartmentId } },
      })
    )

    return apartment
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})

type OwnerApartmentsQuery = QueryParameters<
  "/api/v1/apartments/by-owner/{ownerId}",
  "get"
>

/** Owner listings for the server render. Returns an empty list when the owner has none or isn't found. */

export const getOwnerApartmentsServer = cache(
  async (ownerId: string, query?: OwnerApartmentsQuery) => {
    try {
      const owner = await unwrap(
        await apiClient.GET("/api/v1/apartments/by-owner/{ownerId}", {
          params: { path: { ownerId: ownerId }, query },
        })
      )

      return owner
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null
      throw error
    }
  }
)
