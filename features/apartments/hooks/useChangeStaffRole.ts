"use client"

import { useTranslations } from "next-intl"

import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { changeApartmentStaffRole } from "../api/apartment-staff"
import type { ChangeApartmentStaffRoleRequest } from "@/lib/api/types/apartments"

interface ChangeStaffRoleInput {
  assignmentId: string
  body: ChangeApartmentStaffRoleRequest
}

export function useChangeStaffRole(apartmentId: string) {
  const t = useTranslations("apartmentManage.staff")

  return useApiMutation<void, ChangeStaffRoleInput>({
    mutationFn: ({ assignmentId, body }) =>
      changeApartmentStaffRole(assignmentId, body),
    invalidate: [queryKeys.apartments.staff(apartmentId)],
    successMessage: t("roleUpdatedToast"),
    errorMessage: t("roleUpdateErrorToast"),
  })
}
