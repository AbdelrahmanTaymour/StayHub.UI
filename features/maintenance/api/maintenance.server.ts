import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { ApiError, unwrap } from "@/lib/errors/api-error"
import { ApartmentMaintenanceRequestsQuery } from "@/lib/api/types/maintenance"

export const getApartmentMaintenanceRequestsServer = cache(
  async (id: string, query?: ApartmentMaintenanceRequestsQuery) =>
    unwrap(
      await apiClient.GET("/api/v1/apartments/{id}/maintenance-requests", {
        params: { path: { id }, query },
      })
    )
)

export const getMaintenanceRequestServer = cache(async (requestId: string) => {
  try {
    return await unwrap(
      await apiClient.GET(
        "/api/v1/apartments/maintenance-requests/{requestId}",
        {
          params: { path: { requestId } },
        }
      )
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})
