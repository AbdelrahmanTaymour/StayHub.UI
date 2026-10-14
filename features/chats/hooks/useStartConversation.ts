"use client"

import { useTranslations } from "next-intl"

import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { startConversation } from "../api/conversations"

export function useStartConversation() {
  const t = useTranslations("chats")
  return useApiMutation({
    mutationFn: startConversation,
    invalidate: [queryKeys.chats.all],
    errorMessage: t("startErrorToast"),
  })
}
