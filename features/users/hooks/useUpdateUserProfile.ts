"use client"

import { useTranslations } from "next-intl"

import { updateUserProfile } from "@/features/users/api/users"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useUpdateUserProfile() {
  const t = useTranslations("profile")
  return useApiMutation({
    mutationFn: updateUserProfile,
    successMessage: t("savedToast"),
    invalidate: [queryKeys.users.me()],
  })
}
