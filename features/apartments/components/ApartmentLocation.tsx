import { useTranslations } from "next-intl"

import type { ApartmentAddress } from "@/features/apartments/types/apartment-details"
import { formatAddress } from "@/features/apartments/utils/format-address"
import { ApartmentMap } from "./ApartmentMap"

interface ApartmentLocationProps {
  address: ApartmentAddress
}

export function ApartmentLocation({ address }: ApartmentLocationProps) {
  const t = useTranslations("apartmentDetails.location")
  const formattedAddress = formatAddress(address)

  return (
    <section
      aria-labelledby="apartment-location-heading"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <h2
        id="apartment-location-heading"
        className="text-xl font-semibold text-foreground"
      >
        {t("title")}
      </h2>

      {formattedAddress ? (
        <>
          <p className="text-sm text-muted-foreground">{formattedAddress}</p>
          <ApartmentMap address={formattedAddress} />
        </>
      ) : null}
    </section>
  )
}
