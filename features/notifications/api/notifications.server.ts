import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { unwrap } from "@/lib/errors/api-error"
import type { QueryParameters } from "@/lib/api/type-utils"

type GetNotificationsQuery = QueryParameters<"/api/v1/notifications", "get">

export const getMyNotificationsServer = cache(
  async (query?: GetNotificationsQuery) =>
    unwrap(
      await apiClient.GET("/api/v1/notifications", {
        params: { query },
      })
    )
)
