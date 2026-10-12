import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { CreateApartmentSheet } from "@/features/apartments/components/CreateApartmentSheet"
import { MyApartmentsDashboard } from "@/features/apartments/components/MyApartmentsDashboard"
import { MyApartmentsView } from "@/features/apartments/components/MyApartmentsView"
import {
  getMyApartmentsDashboardServer,
  getMyApartmentsServer,
} from "@/features/apartments/api/apartments.server"
import { getApartmentFilter } from "@/features/apartments/utils/apartment-filters"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

const PAGE_SIZE = 10

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("myApartments")
  return { title: t("pageTitle"), description: t("metaDescription") }
}

interface MyApartmentsPageProps {
  searchParams: Promise<{ filter?: string; q?: string; page?: string }>
}

export default async function MyApartmentsPage({
  searchParams,
}: MyApartmentsPageProps) {
  const { filter, q, page: pageParam } = await searchParams

  const t = await getTranslations("myApartments")
  const status = getApartmentFilter(filter)
  const page = Number(pageParam) || 1

  const dashboard = await getMyApartmentsDashboardServer()

  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.apartments.mine(status, q, page),
    queryFn: () =>
      getMyApartmentsServer({
        status,
        search: q || undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
  })

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
      <PageHeader
        title={t("pageTitle")}
        meta={t("pageDescription")}
        actions={
          <>
            <Button type="button" variant="outline" disabled className="gap-2">
              {t("exportReport")}
            </Button>
            <CreateApartmentSheet />
          </>
        }
      />

      <MyApartmentsDashboard dashboard={dashboard} />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyApartmentsView />
      </HydrationBoundary>
    </div>
  )
}
