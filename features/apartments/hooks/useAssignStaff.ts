"use client"

import { useTranslations } from "next-intl"

import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import type { AssignApartmentStaffRequest } from "@/lib/api/types/apartments"
import { assignApartmentStaff } from "@/features/apartments/api/apartment-staff"

export function useAssignStaff(apartmentId: string) {
  const t = useTranslations("apartmentManage.staff")

  return useApiMutation<string, AssignApartmentStaffRequest>({
    mutationFn: (body) => assignApartmentStaff(apartmentId, body),
    invalidate: [queryKeys.apartments.staff(apartmentId)],
    successMessage: t("assignSuccessToast"),
    errorMessage: t("assignErrorToast"),
  })
}
