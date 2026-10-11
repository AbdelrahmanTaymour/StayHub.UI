"use client"

import { ChatRealtimeAdapter, ChatRealtimeHandlers } from "./types"

const INBOX_INTERVAL_MS = 15_000
const ACTIVE_CONVERSATION_INTERVAL_MS = 4_000

/**
 * TEMPORARY. Stands in for a SignalR connection until one exists on the
 * backend. Polls on an interval, paused while the tab isn't visible, and
 * only ever reports "this might have changed" — the same shape a real push
 * event would have, so query-invalidation callers (RealtimeProvider) don't
 * need to change when this is replaced.
 *
 * DELETE THIS FILE when a SignalR hub exists. Nothing outside this folder
 * references it directly — only RealtimeProvider's one import line does.
 */
export function createPollingAdapter(): ChatRealtimeAdapter {
  let handlers: ChatRealtimeHandlers | null = null
  let inboxTimer: ReturnType<typeof setInterval> | null = null
  let activeTimer: ReturnType<typeof setInterval> | null = null
  let activeConversationId: string | null = null

  function pollInbox() {
    if (document.visibilityState !== "visible") return
    handlers?.onInboxShouldRefresh()
  }

  function pollActiveConversation() {
    if (!activeConversationId || document.visibilityState !== "visible") return
    handlers?.onConversationShouldRefresh(activeConversationId)
  }

  return {
    connect(h) {
      handlers = h
      inboxTimer = setInterval(pollInbox, INBOX_INTERVAL_MS)
    },

    disconnect() {
      if (inboxTimer) clearInterval(inboxTimer)
      if (activeTimer) clearInterval(activeTimer)
      inboxTimer = null
      activeTimer = null
      handlers = null
    },

    joinConversation(conversationId) {
      activeConversationId = conversationId
      if (activeTimer) clearInterval(activeTimer)
      activeTimer = setInterval(
        pollActiveConversation,
        ACTIVE_CONVERSATION_INTERVAL_MS
      )
    },

    leaveConversation(conversationId) {
      if (activeConversationId !== conversationId) return
      activeConversationId = null
      if (activeTimer) clearInterval(activeTimer)
      activeTimer = null
    },
  }
}
