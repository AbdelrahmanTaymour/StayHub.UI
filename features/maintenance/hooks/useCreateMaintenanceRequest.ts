"use client"

import { useTranslations } from "next-intl"

import { createMaintenanceRequest } from "@/features/maintenance/api/maintenance"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import type { CreateMaintenanceRequestFormValues } from "../schemas/create-maintenance-request-schema"

export function useCreateMaintenanceRequest(apartmentId: string) {
  const t = useTranslations("apartmentManage.maintenance")

  return useApiMutation<string, CreateMaintenanceRequestFormValues>({
    mutationFn: (body) => createMaintenanceRequest(apartmentId, body),
    successMessage: t("createdToast"),
    invalidate: [queryKeys.maintenance.byApartment(apartmentId)],
    errorMessage: t("createErrorToast"),
  })
}
