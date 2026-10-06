type AddressFields =
  | {
      street?: string | null
      city?: string | null
      state?: string | null
      country?: string | null
    }
  | null
  | undefined

export function formatAddress(address: AddressFields): string {
  return [address?.street, address?.city, address?.state, address?.country]
    .filter(Boolean)
    .join(", ")
}

export function formatCityCountry(address: AddressFields): string {
  return [address?.city, address?.country].filter(Boolean).join(", ")
}
