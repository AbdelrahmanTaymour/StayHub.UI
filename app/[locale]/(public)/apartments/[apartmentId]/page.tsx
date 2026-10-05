import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getApartmentDetailsServer } from "@/features/apartments/api/apartments.server"
import { ApartmentDetailsView } from "@/features/apartments/components/ApartmentDetailsView"

interface ApartmentDetailsPageProps {
  params: Promise<{ apartmentId: string }>
}

export async function generateMetadata({
  params,
}: ApartmentDetailsPageProps): Promise<Metadata> {
  const { apartmentId } = await params
  const apartment = await getApartmentDetailsServer(apartmentId)

  if (!apartment) return {}

  return {
    title: apartment.name ?? undefined,
    description: apartment.description?.slice(0, 160) ?? undefined,
  }
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
