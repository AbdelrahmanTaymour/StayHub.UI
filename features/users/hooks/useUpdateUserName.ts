"use client"

import { useTranslations } from "next-intl"

import { updateUserName } from "@/features/users/api/users"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useUpdateUserName() {
  const t = useTranslations("profile")
  return useApiMutation({
    mutationFn: updateUserName,
    successMessage: t("savedToast"),
    invalidate: [queryKeys.users.me()],
  })
}
