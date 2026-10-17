"use client"

import { useTranslations } from "next-intl"

import { useApiMutation } from "@/lib/query/use-api-mutation"
import type { InviteStaffRequest } from "@/lib/api/types/apartments"
import { inviteStaff } from "@/features/apartments/api/apartment-staff"

export function useInviteStaff(apartmentId: string) {
  const t = useTranslations("apartmentManage.staff")

  return useApiMutation<void, InviteStaffRequest>({
    mutationFn: (body) => inviteStaff(apartmentId, body),
    successMessage: t("inviteSuccessToast"),
    errorMessage: t("inviteErrorToast"),
  })
}
