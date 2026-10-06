import type { QueryParameters } from "@/lib/api/type-utils"
import type { ApartmentSearchFormValues } from "@/features/apartments/schemas/apartment-search-schema"
import {
  fromDateOnly,
  toDateOnly,
} from "@/features/apartments/utils/stay-range"
import { DateRangeValue } from "@/components/common/DateRangePicker"

type SearchApartmentsQuery = QueryParameters<"/api/v1/apartments", "get">

/** URL-shaped filters. Dates are YYYY-MM-DD strings, the same format the API expects. */
export interface ApartmentSearchFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  start?: string
  end?: string
  page?: number
}

type SearchParamsReader = { get(name: string): string | null }

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parsePage(value: string | null): number | undefined {
  const parsed = parseNumber(value)
  return parsed !== undefined && Number.isInteger(parsed) && parsed > 0
    ? parsed
    : undefined
}

function parseDateOnly(value: string | null): string | undefined {
  if (!value) return undefined
  const date = fromDateOnly(value)
  return date && !Number.isNaN(date.getTime()) ? value : undefined
}

export function filtersFromSearchParams(
  params: SearchParamsReader
): ApartmentSearchFilters {
  return {
    city: params.get("city") || undefined,
    minPrice: parseNumber(params.get("minPrice")),
    maxPrice: parseNumber(params.get("maxPrice")),
    start: parseDateOnly(params.get("start")),
    end: parseDateOnly(params.get("end")),
    page: parsePage(params.get("page")),
  }
}

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

/** Form values to URL filters. A new search always starts on page one. */
export function formValuesToFilters(
  values: ApartmentSearchFormValues
): ApartmentSearchFilters {
  return {
    city: values.city || undefined,
    minPrice: values.minPrice,
    maxPrice: values.maxPrice,
    start: values.stay?.from ? toDateOnly(values.stay.from) : undefined,
    end: values.stay?.to ? toDateOnly(values.stay.to) : undefined,
  }
}

/** URL filters to the stay shape the date picker uses. */
export function stayFromSearchParams(
  filters: ApartmentSearchFilters
): DateRangeValue | undefined {
  if (!filters.start && !filters.end) return undefined
  return {
    from: filters.start ? fromDateOnly(filters.start) : undefined,
    to: filters.end ? fromDateOnly(filters.end) : undefined,
  }
}

/**
 * Builds the request for `GET /api/v1/apartments`. The object literal is typed
 * against the generated query, so if a parameter name differs, TypeScript flags
 * the exact key to rename here.
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
    Page: filters.page,
  }
}
