import type { components, operations, paths } from "../generated/api"
import { QueryParameters } from "../type-utils"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

// FAVORITES
export type FavoriteApartmentResponse =
  Schemas["StayHub.Application.Favorites.GetFavoriteApartments.FavoriteApartmentResponse"]

export type GetFavoritesQuery = QueryParameters<"/api/v1/favorites", "get">
