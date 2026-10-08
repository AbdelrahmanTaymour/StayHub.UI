import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { ApartmentDetailsView } from "@/features/apartments/components/ApartmentDetailsView"
import { getApartmentDetailsServer } from "@/features/apartments/api/apartments.server"
import { formatCityCountry } from "@/lib/utils/format-address"

interface ApartmentDetailsPageProps {
  params: Promise<{ locale: string; apartmentId: string }>
}

export async function generateMetadata({
  params,
}: ApartmentDetailsPageProps): Promise<Metadata> {
  const { locale, apartmentId } = await params
  const apartment = await getApartmentDetailsServer(apartmentId)
  if (!apartment) return {}

  const t = await getTranslations({
    locale,
    namespace: "apartmentDetails.meta",
  })
  const title = apartment.name ?? t("fallbackTitle")
  const location = formatCityCountry(apartment.address)
  const summary = apartment.description?.trim()

  let description: string
  if (summary) description = summary.slice(0, 155)
  else if (location) description = t("withLocation", { name: title, location })
  else description = t("withoutLocation", { name: title })

  return { title, description }
}

export default async function ApartmentDetailsPage({
  params,
}: ApartmentDetailsPageProps) {
  const { apartmentId } = await params

  const apartment = await getApartmentDetailsServer(apartmentId)
  if (!apartment) notFound()

  return (
    <ApartmentDetailsView apartmentId={apartmentId} apartment={apartment} />
  )
}
