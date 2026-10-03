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
  const { data, error } = await apiClient.GET("/api/v1/apartments", {
    params: { query },
  })
  if (error) throw error
  return data
}

export async function createApartment(body: CreateApartmentRequest) {
  const { data, error } = await apiClient.POST("/api/v1/apartments", { body })
  if (error) throw error
  return data
}

export async function getApartment(id: string) {
  const { data, error } = await apiClient.GET("/api/v1/apartments/{id}", {
    params: { path: { id } },
  })
  if (error) throw error
  return data
}

export async function updateApartment(
  id: string,
  body: UpdateApartmentRequest
) {
  const { error } = await apiClient.PUT("/api/v1/apartments/{id}", {
    params: { path: { id } },
    body,
  })
  if (error) throw error
}

export async function getApartmentForEdit(apartmentId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/{apartmentId}/edit",
    { params: { path: { apartmentId } } }
  )
  if (error) throw error
  return data
}

export async function getMyApartments() {
  const { data, error } = await apiClient.GET("/api/v1/apartments/mine")
  if (error) throw error
  return data
}

export async function getMyApartmentsDashboard() {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/mine/dashboard"
  )
  if (error) throw error
  return data
}

export async function getApartmentsByOwner(
  ownerId: string,
  query?: OwnerApartmentsQuery
) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/by-owner/{ownerId}",
    { params: { path: { ownerId }, query } }
  )
  if (error) throw error
  return data
}

export async function activateApartment(id: string) {
  const { error } = await apiClient.POST("/api/v1/apartments/{id}/activate", {
    params: { path: { id } },
  })
  if (error) throw error
}

export async function deactivateApartment(id: string) {
  const { error } = await apiClient.POST("/api/v1/apartments/{id}/deactivate", {
    params: { path: { id } },
  })
  if (error) throw error
}

/*
type CreateApartmentRequest = {
    name?: string | null;
    description?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string | null;
    priceAmount?: number; // double
    priceCurrency?: string | null;
    cleaningFeeAmount?: number; // double
    cleaningFeeCurrency?: string | null;
}

type UpdateApartmentRequest = {
    name?: string | null;
    description?: string | null;
    priceAmount?: number; // double
    priceCurrency?: string | null;
    cleaningFeeAmount?: number; // double
    cleaningFeeCurrency?: string | null;
}

type SearchApartmentsQuery = {
    City?: string; // filter by city (exact/contains match, backend-defined)
    MinPrice?: number; // minimum nightly price to include
    MaxPrice?: number; // maximum nightly price to include
    Start?: string; // date — only apartments available from this check-in date
    End?: string; // date — only apartments available until this check-out date
    Page?: number; // 1-based page number, defaults to 1 if omitted
    PageSize?: number; // items per page, defaults to a backend-defined value if omitted
}

type OwnerApartmentsQuery = {
    sort?: OwnerApartmentsSort; // sort order for the owner's listed apartments
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}

type OwnerApartmentsSort = "PriceAsc" | "PriceDesc" | "Rating" | "Reviews"
// PriceAsc: cheapest first · PriceDesc: priciest first
// Rating: highest-rated first · Reviews: most-reviewed first

type MyApartmentsFilter = "All" | "Active" | "Inactive"
// All: every apartment owned by the caller
// Active: only apartments currently published/bookable
// Inactive: only apartments currently deactivated/unpublished
// Note: not currently wired to getMyApartments() above — add if that endpoint
// gains a filter query param in a future spec revision.

// Responses

type SearchApartmentsResponse = PagedResponse<SearchApartmentItem>
type SearchApartmentItem = {
    id?: string; // uuid
    name?: string | null;
    city?: string | null;
    pricePerNight?: number; // double
    totalPrice?: number | null; // double
    currency?: string | null;
    primaryImageUrl?: string | null;
    rating?: number | null; // double
    reviewCount?: number; // int32
    isFavorited?: boolean;
}
type PagedResponse<T> = {
    items: T[] | null;
    page?: number; // int32
    pageSize?: number; // int32
    totalCount?: number; // int32
    totalPages?: number; // int32
}

type CreateApartmentResponse = string // new apartment id (uuid)

type GetApartmentResponse = ApartmentResponse
type ApartmentResponse = {
    id?: string; // uuid
    ownerId?: string; // uuid
    name?: string | null;
    description?: string | null;
    address: AddressResponse;
    priceAmount?: number; // double
    priceCurrency?: string | null;
    cleaningFeeAmount?: number; // double
    cleaningFeeCurrency?: string | null;
    isActive?: boolean;
    amenities?: string[] | null;
    images?: ApartmentImageResponse[] | null;
    rating?: number | null; // double
    reviewCount?: number; // int32
    isFavorited?: boolean;
    host: ApartmentHostResponse;
    recentReviews?: ApartmentReviewPreviewResponse[] | null;
}
type AddressResponse = {
    country?: string | null;
    state?: string | null;
    zipCode?: string | null;
    city?: string | null;
    street?: string | null;
}
type ApartmentHostResponse = {
    id?: string; // uuid
    fullName?: string | null;
    avatarUrl?: string | null;
}
type ApartmentImageResponse = {
    id?: string; // uuid
    url?: string | null;
    displayOrder?: number; // int32
    isPrimary?: boolean;
}
type ApartmentReviewPreviewResponse = {
    id?: string; // uuid
    reviewerName?: string | null;
    reviewerAvatarUrl?: string | null;
    rating?: number; // int32
    comment?: string | null;
    createdOnUtc?: string; // date-time
}

type UpdateApartmentResponse = void // 204 No Content

type GetApartmentForEditResponse = ApartmentForEditResponse
type ApartmentForEditResponse = {
    id?: string; // uuid
    title?: string | null;
    description?: string | null;
    isActive?: boolean;
    pricing: ApartmentPricingResponse;
    address: ApartmentAddressResponse;
}
type ApartmentPricingResponse = {
    currency?: string | null;
    nightlyRate?: number; // double
    cleaningFee?: number; // double
}
type ApartmentAddressResponse = {
    street?: string | null;
    city?: string | null;
    zipCode?: string | null;
    country?: string | null;
    state?: string | null;
}

type GetMyApartmentsResponse = MyApartmentsResponse
type MyApartmentsResponse = {
    id?: string; // uuid
    name?: string | null;
    city?: string | null;
    country?: string | null;
    primaryImageUrl?: string | null;
    isActive?: boolean;
    pricePerNight?: number; // double
    currency?: string | null;
    rating?: number | null; // double
    reviewCount?: number; // int32
    occupancyRateLast30Days?: number; // double
    photoCount?: number; // int32
    pendingBookingsCount?: number; // int32
}
// Note: GetMyApartments response content in the generated spec is the bare
// MyApartmentsResponse shape above (not wrapped in PagedResponse) for this endpoint.

type GetMyApartmentsDashboardResponse = MyApartmentsDashboardResponse
type MyApartmentsDashboardResponse = {
    totalCount?: number; // int32
    activeCount?: number; // int32
    inactiveCount?: number; // int32
    pendingBookingsCount?: number; // int32
    currentMonth?: string; // date
    currentMonthOccupancyRate?: number; // double
    previousMonthOccupancyRate?: number; // double
    monthToDateRevenue?: RevenueByCurrencyResponse[] | null;
}
type RevenueByCurrencyResponse = {
    currency?: string | null;
    amount?: number; // double
}

type GetApartmentsByOwnerResponse = OwnerApartmentsResponse[]
type OwnerApartmentsResponse = {
    id?: string; // uuid
    name?: string | null;
    city?: string | null;
    country?: string | null;
    pricePerNight?: number; // double
    currency?: string | null;
    primaryImageUrl?: string | null;
    rating?: number | null; // double
    reviewCount?: number; // int32
    isFavorited?: boolean;
}

type ActivateApartmentResponse = void // 204 No Content
type DeactivateApartmentResponse = void // 204 No Content
*/
