import { useTranslations } from "next-intl"

import {
  getAmenityIcon,
  getAmenityKey,
} from "@/features/apartments/utils/amenity-config"

interface ApartmentAmenitiesProps {
  amenities?: string[] | null
}

export function ApartmentAmenities({ amenities }: ApartmentAmenitiesProps) {
  const t = useTranslations("apartmentDetails.amenities")
  const items = amenities ?? []

  return (
    <section
      aria-labelledby="apartment-amenities-heading"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <h2
        id="apartment-amenities-heading"
        className="text-xl font-semibold text-foreground"
      >
        {t("title")}
      </h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {items.map((raw) => {
            const key = getAmenityKey(raw)
            const Icon = getAmenityIcon(key)
            const label = key && t.has(`items.${key}`) ? t(`items.${key}`) : raw

            return (
              <li key={raw} className="flex items-center gap-3 text-foreground">
                <Icon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary"
                />
                <span>{label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
