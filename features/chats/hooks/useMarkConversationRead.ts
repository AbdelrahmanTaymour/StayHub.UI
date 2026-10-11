"use client"

import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { markConversationRead } from "../api/conversations"

export function useMarkConversationRead() {
  return useApiMutation({
    mutationFn: markConversationRead,
    invalidate: [queryKeys.chats.conversations()],
  })
}
