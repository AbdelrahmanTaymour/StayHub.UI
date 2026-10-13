import "server-only"

import { apiClient } from "@/lib/api/client"
import { unwrap } from "@/lib/errors/api-error"
import { cache } from "react"

export const getApartmentAmenitiesServer = cache(async (apartmentId: string) =>
  unwrap(
    await apiClient.GET("/api/v1/apartments/{apartmentId}/amenities", {
      params: { path: { apartmentId } },
    })
  )
)
