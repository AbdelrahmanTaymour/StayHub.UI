import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { getApartmentBookingsServer } from "@/features/bookings/api/bookings.server"
import { ApartmentBookingsManager } from "@/features/bookings/components/ApartmentBookingsManager"
import {
  getApartmentBookingFilter,
  getApartmentBookingSort,
} from "@/features/bookings/utils/apartment-booking-filters"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

const PAGE_SIZE = 10

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.staff")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

interface BookingsTabPageProps {
  params: Promise<{ locale: string; apartmentId: string }>
  searchParams: Promise<{ filter?: string; sort?: string; page?: string }>
}

export default async function ApartmentBookingsTabPage({
  params,
  searchParams,
}: BookingsTabPageProps) {
  const { apartmentId } = await params
  const { filter, sort, page: pageParam } = await searchParams

  const resolvedFilter = getApartmentBookingFilter(filter)
  const resolvedSort = getApartmentBookingSort(sort)
  const page = Number(pageParam) || 1

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.bookings.byApartment(
      apartmentId,
      resolvedFilter,
      resolvedSort,
      page
    ),
    queryFn: () =>
      getApartmentBookingsServer(apartmentId, {
        status: resolvedFilter,
        sort: resolvedSort,
        page,
        pageSize: PAGE_SIZE,
      }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentBookingsManager apartmentId={apartmentId} />
    </HydrationBoundary>
  )
}
