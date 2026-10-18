// app/[locale]/(account)/me/apartments/[apartmentId]/manage/maintenance/page.tsx
import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { getApartmentMaintenanceRequestsServer } from "@/features/maintenance/api/maintenance.server"
import { ApartmentMaintenanceManager } from "@/features/maintenance/components/ApartmentMaintenanceManager"
import { getMaintenanceFilter } from "@/features/maintenance/utils/maintenance-filters"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

const PAGE_SIZE = 10

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.maintenance")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

interface MaintenanceTabPageProps {
  params: Promise<{ locale: string; apartmentId: string }>
  searchParams: Promise<{ filter?: string; q?: string; page?: string }>
}

export default async function ApartmentMaintenanceTabPage({
  params,
  searchParams,
}: MaintenanceTabPageProps) {
  const { locale, apartmentId } = await params
  const { filter, q, page: pageParam } = await searchParams
  setRequestLocale(locale)

  const status = getMaintenanceFilter(filter)
  const resolvedStatus = status === "All" ? undefined : status
  const page = Number(pageParam) || 1

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.maintenance.byApartment(
      apartmentId,
      resolvedStatus,
      q,
      page
    ),
    queryFn: () =>
      getApartmentMaintenanceRequestsServer(apartmentId, {
        status: resolvedStatus,
        search: q || undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentMaintenanceManager apartmentId={apartmentId} />
    </HydrationBoundary>
  )
}
