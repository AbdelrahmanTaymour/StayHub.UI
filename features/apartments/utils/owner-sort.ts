import type { QueryParameters } from "@/lib/api/type-utils"

type OwnerApartmentsQuery = QueryParameters<
  "/api/v1/apartments/by-owner/{ownerId}",
  "get"
>

export type OwnerApartmentsSort = NonNullable<OwnerApartmentsQuery["sort"]>

/** `value` is the URL parameter and the translation key. `apiValue` is what the backend expects. */
export const OWNER_SORT_OPTIONS = [
  { value: "price-asc", apiValue: "PriceAsc" },
  { value: "price-desc", apiValue: "PriceDesc" },
  { value: "rating", apiValue: "Rating" },
  { value: "reviews", apiValue: "Reviews" },
] as const satisfies readonly {
  value: string
  apiValue: OwnerApartmentsSort
}[]

export const DEFAULT_OWNER_SORT = OWNER_SORT_OPTIONS[0].value

/** Unknown or missing values fall back to the default, so a bad URL never reaches the API. */
export function getOwnerApiSort(
  value: string | undefined
): OwnerApartmentsSort {
  const match = OWNER_SORT_OPTIONS.find((option) => option.value === value)
  return (match ?? OWNER_SORT_OPTIONS[0]).apiValue
}
