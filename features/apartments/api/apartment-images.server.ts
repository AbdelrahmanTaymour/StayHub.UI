import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { unwrap } from "@/lib/errors/api-error"

export const getApartmentImagesServer = cache(async (apartmentId: string) =>
  unwrap(
    await apiClient.GET("/api/v1/apartments/{apartmentId}/images", {
      params: { path: { apartmentId } },
    })
  )
)
