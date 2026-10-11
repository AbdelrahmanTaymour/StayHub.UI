"use client"

import * as signalR from "@microsoft/signalr"

import type { ChatRealtimeAdapter, ChatRealtimeHandlers } from "./types"

const HUB_URL = `${process.env.NEXT_PUBLIC_API_URL}/hubs/conversations`

async function fetchAccessToken(): Promise<string> {
  const response = await fetch("/api/auth/signalr-token")

  if (!response.ok) {
    throw new Error(`Failed to fetch SignalR access token (${response.status})`)
  }

  const { accessToken } = (await response.json()) as { accessToken: string }
  return accessToken
}

export function createSignalRAdapter(): ChatRealtimeAdapter {
  let connection: signalR.HubConnection | null = null
  // useJoinConversation's effect can fire before connect()'s `start()`
  // promise resolves (connect() doesn't await it) — track requested joins
  // here and flush them once actually connected, instead of silently
  // dropping a join that arrived too early.
  const joinedConversations = new Set<string>()

  function build(handlers: ChatRealtimeHandlers) {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: fetchAccessToken })
      .withAutomaticReconnect()
      .build()

    conn.on("InboxUpdated", () => {
      handlers.onInboxShouldRefresh()
    })

    conn.on("ConversationUpdated", (conversationId: string) => {
      handlers.onConversationShouldRefresh(conversationId)
    })

    // A reconnect can silently drop pushes sent during the gap (phone
    // sleep, brief network loss) — refresh the inbox once to catch up.
    conn.onreconnected(() => {
      handlers.onInboxShouldRefresh()
    })

    return conn
  }

  async function flushJoins() {
    if (connection?.state !== signalR.HubConnectionState.Connected) return
    for (const conversationId of joinedConversations) {
      await connection.invoke("JoinConversation", conversationId)
    }
  }

  return {
    connect(handlers) {
      connection = build(handlers)
      connection.onreconnected(() => void flushJoins()) // re-join rooms lost when the connection dropped
      void connection.start().then(flushJoins)
    },

    disconnect() {
      void connection?.stop()
      connection = null
      joinedConversations.clear()
    },

    joinConversation(conversationId) {
      joinedConversations.add(conversationId)
      if (connection?.state === signalR.HubConnectionState.Connected) {
        void connection.invoke("JoinConversation", conversationId)
      }
      // else: start()'s .then(flushJoins) or the next onreconnected will pick it up.
    },

    leaveConversation(conversationId) {
      joinedConversations.delete(conversationId)
      if (connection?.state === signalR.HubConnectionState.Connected) {
        void connection.invoke("LeaveConversation", conversationId)
      }
    },
  }
}
