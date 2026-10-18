import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { unwrap } from "@/lib/errors/api-error"
import { ApartmentMaintenanceRequestsQuery } from "@/lib/api/types/maintenance"

export const getApartmentMaintenanceRequestsServer = cache(
  async (id: string, query?: ApartmentMaintenanceRequestsQuery) =>
    unwrap(
      await apiClient.GET("/api/v1/apartments/{id}/maintenance-requests", {
        params: { path: { id }, query },
      })
    )
)
