import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { getApartmentImagesServer } from "@/features/apartments/api/apartment-images.server"
import { ApartmentImageManager } from "@/features/apartments/components/ApartmentImageManager"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.images")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

interface ImagesTabPageProps {
  params: Promise<{ apartmentId: string }>
}

export default async function ApartmentImagesTabPage({
  params,
}: ImagesTabPageProps) {
  const { apartmentId } = await params

  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.apartments.images(apartmentId),
    queryFn: () => getApartmentImagesServer(apartmentId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentImageManager apartmentId={apartmentId} />
    </HydrationBoundary>
  )
}
