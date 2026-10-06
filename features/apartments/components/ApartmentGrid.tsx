import {
  ApartmentCard,
  ApartmentCardData,
} from "@/components/common/ApartmentCard"
import { ApartmentCardSkeleton } from "@/features/apartments/components/ApartmentCardSkeleton"
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton"
import { cn } from "cn"

const SKELETON_COUNT = 8

interface ApartmentGridProps {
  apartments: ApartmentCardData[]
  className?: string
}

export function ApartmentGrid({ apartments, className }: ApartmentGridProps) {
  return (
    <ul className={cn("grid gap-6 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {apartments.map((apartment) => (
        <li key={apartment.id}>
          <ApartmentCard
            apartment={apartment}
            favoriteButton={
              apartment.id ? (
                <FavoriteButton
                  apartmentId={apartment.id}
                  isFavorited={apartment.isFavorited}
                />
              ) : null
            }
          />
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
