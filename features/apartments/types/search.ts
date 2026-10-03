import type { searchApartments } from "@/features/apartments/api/apartments"

type SearchApartmentsResult = Awaited<ReturnType<typeof searchApartments>>

export type ApartmentSearchResult = NonNullable<SearchApartmentsResult>
export type ApartmentSummary = NonNullable<
  ApartmentSearchResult["items"]
>[number]
