import type { QueryParameters } from "@/lib/api/type-utils"

type SearchApartmentsQuery = QueryParameters<"/api/v1/apartments", "get">
type GetFavoritesQuery = QueryParameters<"/api/v1/favorites", "get">

/**
 * Single source of truth for query keys. Keys are hierarchical, so
 * invalidating a parent (e.g. apartments.all) also matches its children.
 */
export const queryKeys = {
  apartments: {
    all: ["apartments"] as const,
    search: () => ["apartments", "search"] as const,
    searchList: (query?: SearchApartmentsQuery) =>
      ["apartments", "search", query] as const,
    detail: (id: string) => ["apartments", "detail", id] as const,
  },
  favorites: {
    all: ["favorites"] as const,
    list: (query?: GetFavoritesQuery) => ["favorites", "list", query] as const,
  },
} as const
