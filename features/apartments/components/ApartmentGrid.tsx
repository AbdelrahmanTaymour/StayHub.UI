import { ApartmentCard } from "@/features/apartments/components/ApartmentCard"
import { ApartmentCardSkeleton } from "@/features/apartments/components/ApartmentCardSkeleton"
import type { ApartmentSummary } from "@/features/apartments/types/search"

const SKELETON_COUNT = 8

export function ApartmentGrid({
  apartments,
}: {
  apartments: ApartmentSummary[]
}) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apartments.map((apartment, index) => (
        <li key={apartment.id ?? index}>
          <ApartmentCard apartment={apartment} />
        </li>
      ))}
    </ul>
  )
}

export function ApartmentGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <ApartmentCardSkeleton key={index} />
      ))}
    </div>
  )
}
