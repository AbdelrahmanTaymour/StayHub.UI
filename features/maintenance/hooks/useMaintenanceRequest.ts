"use client"

import { useQuery } from "@tanstack/react-query"

import { getMaintenanceRequest } from "@/features/maintenance/api/maintenance"
import { queryKeys } from "@/lib/query/query-keys"

export function useMaintenanceRequest(requestId: string) {
  return useQuery({
    queryKey: queryKeys.maintenance.detail(requestId),
    queryFn: () => getMaintenanceRequest(requestId),
  })
}
