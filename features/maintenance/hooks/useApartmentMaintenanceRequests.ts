"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getApartmentMaintenanceRequests } from "@/features/maintenance/api/maintenance"
import { queryKeys } from "@/lib/query/query-keys"
import type { MaintenanceStatusFilter } from "../utils/maintenance-filters"

interface UseApartmentMaintenanceRequestsParams {
  apartmentId: string
  status: MaintenanceStatusFilter
  search?: string
  page: number
  pageSize: number
}

export function useApartmentMaintenanceRequests({
  apartmentId,
  status,
  search,
  page,
  pageSize,
}: UseApartmentMaintenanceRequestsParams) {
  const resolvedStatus = status === "All" ? undefined : status

  return useQuery({
    queryKey: queryKeys.maintenance.byApartmentList(
      apartmentId,
      resolvedStatus,
      search,
      page
    ),
    queryFn: () =>
      getApartmentMaintenanceRequests(apartmentId, {
        status: resolvedStatus,
        search,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  })
}
