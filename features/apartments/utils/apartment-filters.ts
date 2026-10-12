import { MyApartmentsFilter } from "@/lib/api/types/apartments"

export const APARTMENT_TABS = [
  "All",
  "Active",
  "Inactive",
] as const satisfies readonly MyApartmentsFilter[]
export const DEFAULT_APARTMENT_TAB: MyApartmentsFilter = "All"

export function getApartmentFilter(
  value: string | undefined
): MyApartmentsFilter {
  return APARTMENT_TABS.find((tab) => tab === value) ?? DEFAULT_APARTMENT_TAB
}
