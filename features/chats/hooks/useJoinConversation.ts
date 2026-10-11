"use client"

import { useEffect } from "react"
import { useChatRealtime } from "../realtime/RealtimeProvider"

/** Subscribes to live updates for one conversation while mounted. Works identically whether the adapter is polling or SignalR. */
export function useJoinConversation(conversationId: string | undefined) {
  const adapter = useChatRealtime()

  useEffect(() => {
    if (!conversationId) return

    adapter.joinConversation(conversationId)
    return () => adapter.leaveConversation(conversationId)
  }, [conversationId, adapter])
}
