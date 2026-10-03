import type { QueryParameters } from "@/lib/api/type-utils"

type SearchApartmentsQuery = QueryParameters<"/api/v1/apartments", "get">

export const DEFAULT_PAGE_SIZE = 12

export interface ApartmentSearchFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  start?: string
  end?: string
  page?: number
}

/**
 * Parses the URL's search params into our internal filter shape.
 * This is the single place that knows the (lowercase) URL param names.
 */
export function filtersFromSearchParams(
  params: URLSearchParams
): ApartmentSearchFilters {
  const minPrice = params.get("minPrice")
  const maxPrice = params.get("maxPrice")
  const page = params.get("page")

  return {
    city: params.get("city") ?? undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    start: params.get("start") ?? undefined,
    end: params.get("end") ?? undefined,
    page: page ? Number(page) : undefined,
  }
}

/**
 * Builds the URL search params from our internal filter shape (for pushing
 * new URLs when the search form is submitted or pagination changes).
 */
export function filtersToSearchParams(
  filters: ApartmentSearchFilters
): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.city) params.set("city", filters.city)
  if (filters.minPrice !== undefined)
    params.set("minPrice", String(filters.minPrice))
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", String(filters.maxPrice))
  if (filters.start) params.set("start", filters.start)
  if (filters.end) params.set("end", filters.end)
  if (filters.page && filters.page > 1) params.set("page", String(filters.page))
  return params
}

/**
 * Maps our internal filter shape to the backend's exact (PascalCase) query
 * parameter names, as generated from the OpenAPI contract.
 */
export function filtersToApiQuery(
  filters: ApartmentSearchFilters
): SearchApartmentsQuery {
  return {
    City: filters.city,
    MinPrice: filters.minPrice,
    MaxPrice: filters.maxPrice,
    Start: filters.start,
    End: filters.end,
    Page: filters.page ?? 1,
    PageSize: DEFAULT_PAGE_SIZE,
  }
}
