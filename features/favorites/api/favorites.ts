import { apiClient } from "@/lib/api/client"
import { QueryParameters } from "@/lib/api/type-utils"

type GetFavoritesQuery = QueryParameters<"/api/v1/favorites", "get">

export async function getFavorites(query?: GetFavoritesQuery) {
  const { data, error } = await apiClient.GET("/api/v1/favorites", {
    params: { query },
  })
  if (error) throw error
  return data
}

export async function addFavorite(apartmentId: string) {
  const { error } = await apiClient.PUT("/api/v1/favorites/{apartmentId}", {
    params: { path: { apartmentId } },
  })
  if (error) throw error
}

export async function removeFavorite(apartmentId: string) {
  const { error } = await apiClient.DELETE("/api/v1/favorites/{apartmentId}", {
    params: { path: { apartmentId } },
  })
  if (error) throw error
}

/*
type GetFavoritesQuery = {
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}

// Responses

type GetFavoritesResponse = PagedResponse<FavoriteApartmentResponse>
type FavoriteApartmentResponse = {
    apartmentId?: string; // uuid
    name?: string | null;
    city?: string | null;
    pricePerNight?: number; // double
    currency?: string | null;
    primaryImageUrl?: string | null;
    rating?: number | null; // double
    reviewCount?: number; // int32
}
type PagedResponse<T> = {
    items: T[] | null;
    page?: number; // int32
    pageSize?: number; // int32
    totalCount?: number; // int32
    totalPages?: number; // int32
}

type AddFavoriteResponse = void // 204 No Content
type RemoveFavoriteResponse = void // 204 No Content
*/
