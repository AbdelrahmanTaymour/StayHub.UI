import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { GetFavoritesQuery } from "@/lib/api/types/favorites"
import { unwrap } from "@/lib/errors/api-error"

export async function getFavorites(query?: GetFavoritesQuery) {
  return unwrap(await apiClient.GET("/api/v1/favorites", { params: { query } }))
}

export async function addFavorite(apartmentId: string) {
  return unwrap(
    await apiClient.PUT("/api/v1/favorites/{apartmentId}", {
      params: { path: { apartmentId } },
    })
  )
}

export async function removeFavorite(apartmentId: string) {
  return unwrap(
    await apiClient.DELETE("/api/v1/favorites/{apartmentId}", {
      params: { path: { apartmentId } },
    })
  )
}
