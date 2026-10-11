"use client"

import type { ConversationMessagesResponse } from "@/lib/api/types/conversations"

/**
 * Inserts a message into the newest loaded page of an infinite query
 * without refetching. The backend returns pages and rows newest-first, so
 * a new message belongs at the FRONT of pages[0].
 */
export function prependMessageToInfiniteCache(
  data:
    | {
        pages: { items: ConversationMessagesResponse[] | null }[]
        pageParams: unknown[]
      }
    | undefined,
  message: ConversationMessagesResponse
) {
  if (!data || data.pages.length === 0) return data
  const pages = [...data.pages]
  pages[0] = { ...pages[0], items: [message, ...(pages[0].items ?? [])] }
  return { ...data, pages }
}
