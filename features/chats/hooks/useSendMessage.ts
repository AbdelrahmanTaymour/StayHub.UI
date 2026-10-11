"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { useAuth } from "@/providers/AuthContext"
import { prependMessageToInfiniteCache } from "../utils/message-cache"
import { sendMessage } from "../api/messages"

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("chats")
  const { session } = useAuth()

  return useApiMutation<string, { body: string }, { optimisticId: string }>({
    mutationFn: ({ body }) => sendMessage(conversationId, { body }),

    onMutate: async ({ body }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.chats.messages(conversationId),
      })

      const optimisticId = `optimistic-${Date.now()}`
      queryClient.setQueryData(
        queryKeys.chats.messages(conversationId),
        (data: Parameters<typeof prependMessageToInfiniteCache>[0]) =>
          prependMessageToInfiniteCache(data, {
            id: optimisticId,
            senderId: session?.user?.id,
            body,
            sentOnUtc: new Date().toISOString(),
            readOnUtc: null,
          })
      )

      return { optimisticId }
    },

    onError: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.messages(conversationId),
      })
    },

    invalidate: [queryKeys.chats.conversations()],
    errorMessage: t("sendErrorToast"),
  })
}
