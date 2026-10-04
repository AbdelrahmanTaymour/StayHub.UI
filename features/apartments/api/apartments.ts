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

export async function getApartmentPricing(
  apartmentId: string,
  start: string,
  end: string
) {
  return unwrap(
    await apiClient.GET("/api/v1/apartments/{apartmentId}/pricing", {
      params: { path: { apartmentId }, query: { start, end } },
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

/*
type ApartmentPricingResponse = {
 isAvailable?: boolean;
 nights?: number;
 pricePerNight?: number;
 subtotalForStay?: number;
 cleaningFee?: number;
 amenitiesUpcharge?: number;
 totalPrice?: number;
 currency?: string | null;
}

GetPricingRequest:
[FromRoute] Guid apartmentId,
        [FromQuery] DateOnly start,
        [FromQuery] DateOnly end,

type ApartmentResponse = {
 id?: string;
 ownerId?: string;
 name?: string | null;
 description?: string | null;
 address: components["schemas"]["StayHub.Application.Apartments.GetApartment.AddressResponse"];
 priceAmount?: number;
 priceCurrency?: string | null;
 cleaningFeeAmount?: number;
 cleaningFeeCurrency?: string | null;
 isActive?: boolean;
 amenities?: string[] | null;
(property) "StayHub.Application.Apartments.GetApartment.ApartmentImageResponse": {
 id?: string;
 url?: string | null;
 displayOrder?: number;
 isPrimary?: boolean;
} rating?: number | null;
 reviewCount?: number;
 isFavorited?: boolean;
 host: {
 id?: string;
 fullName?: string | null;
 avatarUrl?: string | null;
}
 recentReviews?: {
    id?: string;
    reviewerName?: string | null;
    reviewerAvatarUrl?: string | null;
    rating?: number;
    comment?: string | null;
    createdOnUtc?: string;
}
}
*/
