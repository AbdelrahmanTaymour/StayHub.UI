import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { ApartmentAmenitiesManager } from "@/features/apartments/components/ApartmentAmenitiesManager"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"
import { getApartmentAmenitiesServer } from "@/features/apartments/api/apartment-amenities.server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.amenities")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

interface AmenitiesTabPageProps {
  params: Promise<{ locale: string; apartmentId: string }>
}

export default async function ApartmentAmenitiesTabPage({
  params,
}: AmenitiesTabPageProps) {
  const { apartmentId } = await params

  const queryClient = getQueryClient()

  await queryClient.query({
    queryKey: queryKeys.apartments.amenity(apartmentId),
    queryFn: () => getApartmentAmenitiesServer(apartmentId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentAmenitiesManager apartmentId={apartmentId} />
    </HydrationBoundary>
  )
}
