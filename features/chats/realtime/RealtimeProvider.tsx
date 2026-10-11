"use client"

import { useQueryClient } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"

import { queryKeys } from "@/lib/query/query-keys"
import { createSignalRAdapter } from "./signalr-adapter"
import type { ChatRealtimeAdapter } from "./types"

const ChatRealtimeContext = createContext<ChatRealtimeAdapter | null>(null)

/**
 * Mount once, at the top of the /me/chats route tree (the layout).
 *
 * Was on createPollingAdapter() while accessTokenFactory was unresolved —
 * now live on SignalR (see signalr-adapter.ts for the one known,
 * deliberately-not-auto-solved limitation around long-idle-tab token
 * expiry). To roll back to polling temporarily: swap the import/call below
 * for `createPollingAdapter` from "./polling-adapter" — both implement the
 * same ChatRealtimeAdapter interface, so nothing else in the feature needs
 * to change either way.
 */
export function ChatRealtimeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [adapter] = useState<ChatRealtimeAdapter>(() => createSignalRAdapter())

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
