"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import {
  assignMaintenanceRequestStaff,
  closeMaintenanceRequest,
  resolveMaintenanceRequest,
  startMaintenanceRequest,
} from "@/features/maintenance/api/maintenance"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

/**
 * One hook factory shared by every ticket-lifecycle mutation (start,
 * resolve, close, reassign) — they all touch the same two query keys
 * (this ticket's detail, and its apartment's list), so the invalidation
 * logic is defined once instead of four times.
 */
function useTicketMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  requestId: string,
  apartmentId: string,
  successMessage: string,
  errorMessage: string
) {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, TVariables>({
    mutationFn,
    successMessage,
    errorMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.maintenance.detail(requestId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.maintenance.byApartment(apartmentId),
      })
    },
  })
}

export function useStartMaintenanceRequest(
  requestId: string,
  apartmentId: string
) {
  const t = useTranslations("apartmentManage.maintenanceDetail")
  return useTicketMutation(
    () => startMaintenanceRequest(requestId),
    requestId,
    apartmentId,
    t("startedToast"),
    t("startErrorToast")
  )
}

export function useResolveMaintenanceRequest(
  requestId: string,
  apartmentId: string
) {
  const t = useTranslations("apartmentManage.maintenanceDetail")
  return useTicketMutation(
    () => resolveMaintenanceRequest(requestId),
    requestId,
    apartmentId,
    t("resolvedToast"),
    t("resolveErrorToast")
  )
}

export function useCloseMaintenanceRequest(
  requestId: string,
  apartmentId: string
) {
  const t = useTranslations("apartmentManage.maintenanceDetail")
  return useTicketMutation(
    () => closeMaintenanceRequest(requestId),
    requestId,
    apartmentId,
    t("closedToast"),
    t("closeErrorToast")
  )
}

export function useAssignMaintenanceRequestStaff(
  requestId: string,
  apartmentId: string
) {
  const t = useTranslations("apartmentManage.maintenanceDetail")
  return useTicketMutation(
    (staffUserId: string) =>
      assignMaintenanceRequestStaff(requestId, { staffUserId }),
    requestId,
    apartmentId,
    t("assignedToast"),
    t("assignErrorToast")
  )
}
