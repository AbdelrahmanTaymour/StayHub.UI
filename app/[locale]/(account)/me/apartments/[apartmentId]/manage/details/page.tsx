import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { getApartmentForEditServer } from "@/features/apartments/api/apartments.server"
import { ApartmentDetailsForm } from "@/features/apartments/components/ApartmentDetailsForm"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

interface DetailsPageProps {
  params: Promise<{ apartmentId: string }>
}

export default async function ApartmentDetailsTabPage({
  params,
}: DetailsPageProps) {
  const { apartmentId } = await params

  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.apartments.forEdit(apartmentId),
    queryFn: () => getApartmentForEditServer(apartmentId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentDetailsForm apartmentId={apartmentId} />
    </HydrationBoundary>
  )
}
