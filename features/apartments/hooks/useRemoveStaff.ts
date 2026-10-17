"use client"

import { useTranslations } from "next-intl"

import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { removeApartmentStaff } from "../api/apartment-staff"

export function useRemoveStaff(apartmentId: string) {
  const t = useTranslations("apartmentManage.staff")

  return useApiMutation<void, string>({
    mutationFn: (assignmentId) => removeApartmentStaff(assignmentId),
    invalidate: [queryKeys.apartments.staff(apartmentId)],
    successMessage: t("revokeSuccessToast"),
    errorMessage: t("revokeErrorToast"),
  })
}
