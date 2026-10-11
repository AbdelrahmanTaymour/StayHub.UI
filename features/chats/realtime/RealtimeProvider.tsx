"use client"

import { useQueryClient } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"

import { queryKeys } from "@/lib/query/query-keys"
import { createPollingAdapter } from "./polling-adapter"
import type { ChatRealtimeAdapter } from "./types"

const ChatRealtimeContext = createContext<ChatRealtimeAdapter | null>(null)

/**
 * Mount once, at the top of the /me/chats route tree (the layout).
 *
 * To move to SignalR: write signalr-adapter.ts implementing
 * ChatRealtimeAdapter, then change the one line below —
 * `createPollingAdapter()` → `createSignalRAdapter()`. Every consumer
 * (useJoinConversation, this provider's own invalidation wiring) is
 * unchanged, since they only know about the adapter interface.
 */
export function ChatRealtimeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [adapter] = useState<ChatRealtimeAdapter>(() => createPollingAdapter())

  useEffect(() => {
    adapter.connect({
      onInboxShouldRefresh: () => {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.chats.conversations(),
        })
      },
      onConversationShouldRefresh: (conversationId) => {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.chats.messages(conversationId),
        })
      },
    })

    return () => adapter.disconnect()
  }, [adapter, queryClient])

  return (
    <ChatRealtimeContext.Provider value={adapter}>
      {children}
    </ChatRealtimeContext.Provider>
  )
}

export function useChatRealtime() {
  const adapter = useContext(ChatRealtimeContext)
  if (!adapter) {
    throw new Error("useChatRealtime must be used within ChatRealtimeProvider")
  }
  return adapter
}
