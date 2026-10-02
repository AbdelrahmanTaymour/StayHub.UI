import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

// FAVORITES
export type FavoriteApartmentResponse =
  Schemas["StayHub.Application.Favorites.GetFavoriteApartments.FavoriteApartmentResponse"]
