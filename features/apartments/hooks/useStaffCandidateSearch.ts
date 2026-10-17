"use client"

import { useTranslations } from "next-intl"

import { ApiError } from "@/lib/errors/api-error"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { searchStaffCandidate } from "../api/apartment-staff"

type StaffCandidateResponse = Awaited<ReturnType<typeof searchStaffCandidate>>

export function useStaffCandidateSearch(apartmentId: string) {
  const t = useTranslations("apartmentManage.staff")

  return useApiMutation<StaffCandidateResponse | null, string>({
    mutationFn: async (email) => {
      try {
        return await searchStaffCandidate(apartmentId, email)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
      }
    },
    errorMessage: t("searchErrorToast"),
  })
}
