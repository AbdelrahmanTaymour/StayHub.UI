import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
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
    <Card as="section" aria-labelledby="apartment-amenities-heading">
      <h2
        id="apartment-amenities-heading"
        className="text-lg font-semibold text-foreground"
      >
        {t("title")}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-foreground">{t("empty")}</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {items.map((raw) => {
            const amenityKey = getAmenityKey(raw)
            const Icon = getAmenityIcon(amenityKey)
            const isKnown =
              amenityKey !== "" && t.has(`items.${amenityKey}.title`)

            return (
              <li key={raw} className="flex items-start gap-4">
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-6 shrink-0 text-tertiary"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">
                    {isKnown ? t(`items.${amenityKey}.title`) : raw}
                  </span>
                  {isKnown ? (
                    <span className="text-sm text-foreground">
                      {t(`items.${amenityKey}.description`)}
                    </span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
