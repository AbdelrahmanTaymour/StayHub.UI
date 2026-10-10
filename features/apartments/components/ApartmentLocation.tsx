import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import type { ApartmentAddress } from "@/features/apartments/types/apartment-details"
import { ApartmentMap } from "./ApartmentMap"
import { formatAddress } from "@/lib/utils/formatAddress"

interface ApartmentLocationProps {
  address: ApartmentAddress
}

export function ApartmentLocation({ address }: ApartmentLocationProps) {
  const t = useTranslations("apartmentDetails.location")
  const formattedAddress = formatAddress(address)

  if (!formattedAddress) return null

  return (
    <Card as="section" aria-labelledby="apartment-location-heading">
      <h2
        id="apartment-location-heading"
        className="text-lg font-semibold text-foreground"
      >
        {t("title")}
      </h2>
      <p className="text-sm text-foreground">{formattedAddress}</p>
      <ApartmentMap address={formattedAddress} />
    </Card>
  )
}
