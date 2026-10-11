"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query/query-keys"
import { useJoinConversation } from "./useJoinConversation"
import { getConversationMessages } from "../api/messages"

const PAGE_SIZE = 30

/**
 * Owns one conversation's message list. Pagination is newest-first, per the
 * backend's ORDER BY sent_on_utc DESC. Live updates come from whichever
 * adapter ChatRealtimeProvider is configured with — this hook has no
 * polling of its own, so swapping adapters changes behavior here for free.
 */
export function useChatThread(conversationId: string | undefined) {
  useJoinConversation(conversationId)

  const query = useInfiniteQuery({
    queryKey: conversationId
      ? queryKeys.chats.messages(conversationId)
      : [...queryKeys.chats.all, "messages", "none"],
    queryFn: ({ pageParam }) =>
      getConversationMessages(conversationId!, {
        page: pageParam,
        pageSize: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page != null &&
      lastPage.totalPages != null &&
      lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined,
    enabled: Boolean(conversationId),
  })

  const messages =
    query.data?.pages
      .slice()
      .reverse()
      .flatMap((page) => (page.items ?? []).slice().reverse()) ?? []

  return { ...query, messages }
}
