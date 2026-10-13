"use client"

import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  getAmenityIcon,
  getAmenityKey,
} from "@/features/apartments/utils/amenity-config"
import { APARTMENT_AMENITIES } from "@/features/apartments/utils/amenity-list"
import { useToggleAmenity } from "@/features/apartments/hooks/useToggleAmenity"
import { useApartmentAmentities } from "../hooks/useApartmentAmenities"
import { Amenity } from "@/lib/api/types/apartments"

export function ApartmentAmenitiesManager({
  apartmentId,
}: {
  apartmentId: string
}) {
  const t = useTranslations("apartmentManage.amenities")
  const { data, isPending } = useApartmentAmentities(apartmentId)
  const { mutate: toggle, isPending: isSaving } = useToggleAmenity(apartmentId)

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const amenities = data?.amenities
  if (!amenities) return null

  const enabledAmenities = new Set(amenities.map((a) => getAmenityKey(a)))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {APARTMENT_AMENITIES.map((amenity) => (
          <AmenityCard
            key={amenity}
            amenity={amenity}
            isEnabled={enabledAmenities.has(getAmenityKey(amenity))}
            isSaving={isSaving}
            onToggle={(enabled) => toggle({ amenity, enabled })}
          />
        ))}
      </div>
    </div>
  )
}

interface AmenityCardProps {
  amenity: Amenity
  isEnabled: boolean
  isSaving: boolean
  onToggle: (enabled: boolean) => void
}

function AmenityCard({
  amenity,
  isEnabled,
  isSaving,
  onToggle,
}: AmenityCardProps) {
  const t = useTranslations("apartmentDetails.amenities.items")
  const key = getAmenityKey(amenity)
  const Icon = getAmenityIcon(key)
  const title = t.has(`${key}.title`) ? t(`${key}.title`) : amenity
  const description = t.has(`${key}.description`)
    ? t(`${key}.description`)
    : undefined

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-tertiary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="text-sm text-foreground/70">{description}</p>
          ) : null}
        </div>
      </div>

      <Switch
        checked={isEnabled}
        disabled={isSaving}
        onCheckedChange={onToggle}
        aria-label={title}
      />
    </div>
  )
}
