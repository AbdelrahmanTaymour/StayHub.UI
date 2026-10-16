import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { getApartmentAvailabilityBlocksServer } from "@/features/apartments/api/apartment-availability.server"
import { ApartmentAvailabilityManager } from "@/features/apartments/components/ApartmentAvailabilityManager"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.availability")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

interface AvailabilityTabPageProps {
  params: Promise<{ locale: string; apartmentId: string }>
}

export default async function ApartmentAvailabilityTabPage({
  params,
}: AvailabilityTabPageProps) {
  const { apartmentId } = await params

  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.apartments.availability(apartmentId),
    queryFn: () => getApartmentAvailabilityBlocksServer(apartmentId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentAvailabilityManager apartmentId={apartmentId} />
    </HydrationBoundary>
  )
}
