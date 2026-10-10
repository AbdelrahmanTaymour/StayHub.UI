import "server-only"

import { apiClient } from "@/lib/api/client"
import { unwrap } from "@/lib/errors/api-error"
import { GetFavoritesQuery } from "@/lib/api/types/favorites"

export async function getFavoritesServer(query?: GetFavoritesQuery) {
  return unwrap(await apiClient.GET("/api/v1/favorites", { params: { query } }))
}
