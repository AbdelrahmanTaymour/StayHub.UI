import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { QueryParameters } from "@/lib/api/type-utils"
import {
  CreateApartmentRequest,
  UpdateApartmentRequest,
} from "@/lib/api/types/apartments"

type SearchApartmentsQuery = QueryParameters<"/api/v1/apartments", "get">
type OwnerApartmentsQuery = QueryParameters<
  "/api/v1/apartments/by-owner/{ownerId}",
  "get"
>

export async function searchApartments(query?: SearchApartmentsQuery) {
  return unwrap(
    await apiClient.GET("/api/v1/apartments", {
      params: { query },
    })
  )
}

export async function createApartment(body: CreateApartmentRequest) {
  return unwrap(await apiClient.POST("/api/v1/apartments", { body }))
}

export async function getApartment(id: string) {
  return unwrap(
    await apiClient.GET("/api/v1/apartments/{id}", {
      params: { path: { id } },
    })
  )
}

export async function updateApartment(
  id: string,
  body: UpdateApartmentRequest
) {
  return unwrap(
    await apiClient.PUT("/api/v1/apartments/{id}", {
      params: { path: { id } },
      body,
    })
  )
}

export async function getApartmentForEdit(apartmentId: string) {
  return unwrap(
    await apiClient.GET("/api/v1/apartments/{apartmentId}/edit", {
      params: { path: { apartmentId } },
    })
  )
}

export async function getMyApartments() {
  return unwrap(await apiClient.GET("/api/v1/apartments/mine"))
}

export async function getMyApartmentsDashboard() {
  return unwrap(await apiClient.GET("/api/v1/apartments/mine/dashboard"))
}

export async function getApartmentsByOwner(
  ownerId: string,
  query?: OwnerApartmentsQuery
) {
  return unwrap(
    await apiClient.GET("/api/v1/apartments/by-owner/{ownerId}", {
      params: { path: { ownerId }, query },
    })
  )
}

export async function activateApartment(id: string) {
  return unwrap(
    await apiClient.POST("/api/v1/apartments/{id}/activate", {
      params: { path: { id } },
    })
  )
}

export async function deactivateApartment(id: string) {
  return unwrap(
    await apiClient.POST("/api/v1/apartments/{id}/deactivate", {
      params: { path: { id } },
    })
  )
}
