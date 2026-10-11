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

/**
 * ============================================================================
 * API ENDPOINTS: QUERIES, REQUESTS, PATH PARAMS, AND RESPONSE FIELDS
 * ============================================================================
 *
 * 2. createApartment (POST /api/v1/apartments)
 *    - Path Parameters: None
 *    - Query Parameters: None
 *    - Request Body: {
 *        name?: string | null;
 *        description?: string | null;
 *        street?: string | null;
 *        city?: string | null;
 *        state?: string | null;
 *        zipCode?: string | null;
 *        country?: string | null;
 *        priceAmount?: number;
 *        priceCurrency?: string | null;
 *        cleaningFeeAmount?: number;
 *        cleaningFeeCurrency?: string | null;
 *      }
 *    - Responses:
 *      - 201 (Created): string (Apartment ID)
 *      - 400 (Bad Request): HttpValidationProblemDetails
 *
 * 6. getMyApartments (GET /api/v1/apartments/mine)
 *    - Path Parameters: None
 *    - Query Parameters: {
 *        status?: "All" | "Active" | "Inactive";
 *        search?: string;
 *        page?: number;
 *        pageSize?: number;
 *      }
 *    - Request Body: None
 *    - Responses:
 *      - 200 (OK): PagedResponseOfStayHub.Application.Apartments.GetMyApartments.MyApartmentsResponse {
 *          items: Array<{
 *            id?: string;
 *            name?: string | null;
 *            city?: string | null;
 *            country?: string | null;
 *            primaryImageUrl?: string | null;
 *            isActive?: boolean;
 *            pricePerNight?: number;
 *            currency?: string | null;
 *            rating?: number | null;
 *            reviewCount?: number;
 *            occupancyRateLast30Days?: number;
 *            photoCount?: number;
 *            pendingBookingsCount?: number;
 *          }> | null;
 *          page?: number;
 *          pageSize?: number;
 *          totalCount?: number;
 *          totalPages?: number;
 *        }
 *
 * 7. getMyApartmentsDashboard (GET /api/v1/apartments/mine/dashboard)
 *    - Path Parameters: None
 *    - Query Parameters: None
 *    - Request Body: None
 *    - Responses:
 *      - 200 (OK): StayHub.Application.Apartments.GetMyApartmentsDashboard.MyApartmentsDashboardResponse {
 *          totalCount?: number;
 *          activeCount?: number;
 *          inactiveCount?: number;
 *          pendingBookingsCount?: number;
 *          currentMonth?: string;
 *          currentMonthOccupancyRate?: number;
 *          previousMonthOccupancyRate?: number;
 *          monthToDateRevenue?: Array<{
 *            currency?: string | null;
 *            amount?: number;
 *          }> | null;
 *        }
 *
 * 10. activateApartment (POST /api/v1/apartments/{id}/activate)
 *     - Path Parameters: { id: string }
 *     - Query Parameters: None
 *     - Request Body: None
 *     - Responses:
 *       - 204 (No Content): void
 *       - 403 (Forbidden): ProblemDetails
 *       - 404 (Not Found): ProblemDetails
 *       - 409 (Conflict): ProblemDetails
 *
 * 11. deactivateApartment (POST /api/v1/apartments/{id}/deactivate)
 *     - Path Parameters: { id: string }
 *     - Query Parameters: None
 *     - Request Body: None
 *     - Responses:
 *       - 204 (No Content): void
 *       - 403 (Forbidden): ProblemDetails
 *       - 404 (Not Found): ProblemDetails
 *       - 409 (Conflict): ProblemDetails
 */
