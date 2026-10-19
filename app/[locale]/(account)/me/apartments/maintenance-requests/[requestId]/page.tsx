import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { getMaintenanceRequestServer } from "@/features/maintenance/api/maintenance.server"
import { MaintenanceRequestDetailView } from "@/features/maintenance/components/MaintenanceRequestDetailView"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

interface MaintenanceDetailPageProps {
  params: Promise<{ locale: string; requestId: string }>
}

export async function generateMetadata({
  params,
}: MaintenanceDetailPageProps): Promise<Metadata> {
  const { requestId } = await params
  const request = await getMaintenanceRequestServer(requestId)
  return {
    title: request?.title ?? "Maintenance Ticket",
    description: request?.description ?? "Maintenance Description",
  }
}

export default async function MaintenanceRequestDetailPage({
  params,
}: MaintenanceDetailPageProps) {
  const { locale, requestId } = await params
  setRequestLocale(locale)

  const request = await getMaintenanceRequestServer(requestId)
  if (!request) notFound()

  const t = await getTranslations("apartmentManage")

  const queryClient = getQueryClient()
  queryClient.setQueryData(queryKeys.maintenance.detail(requestId), request)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <PageBreadcrumb
        items={[
          { label: t("breadcrumbApartments"), href: "/me/apartments" },
          ...(request.apartmentId && request.apartmentName
            ? [
                {
                  label: request.apartmentName,
                  href: `/me/apartments/${request.apartmentId}/manage/details`,
                },
              ]
            : []),
          ...(request.apartmentId
            ? [
                {
                  label: t("tabs.maintenance"),
                  href: `/me/apartments/${request.apartmentId}/manage/maintenance`,
                },
              ]
            : []),
          {
            label: t("maintenanceDetail.ticketLabel", {
              id: shortId(requestId),
            }),
          },
        ]}
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <MaintenanceRequestDetailView requestId={requestId} />
      </HydrationBoundary>
    </div>
  )
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase()
}
