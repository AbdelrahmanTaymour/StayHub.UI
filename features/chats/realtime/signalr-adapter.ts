"use client"

import * as signalR from "@microsoft/signalr"

import type { ChatRealtimeAdapter, ChatRealtimeHandlers } from "./types"

const HUB_URL = `${process.env.NEXT_PUBLIC_API_URL}/hubs/conversations`

const INITIAL_CONNECT_RETRY_DELAYS_MS = [2_000, 5_000, 10_000, 30_000]

async function fetchAccessToken(): Promise<string> {
  const response = await fetch("/api/signalr-token")

  if (!response.ok) {
    throw new Error(`Failed to fetch SignalR access token (${response.status})`)
  }

  const { accessToken } = (await response.json()) as { accessToken: string }
  return accessToken
}

export function createSignalRAdapter(): ChatRealtimeAdapter {
  let connection: signalR.HubConnection | null = null
  let disposed = false
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let retryAttempt = 0

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

    conn.onreconnected(() => {
      handlers.onInboxShouldRefresh()
      retryAttempt = 0
      void flushJoins()
    })

    return conn
  }

  async function flushJoins() {
    if (connection?.state !== signalR.HubConnectionState.Connected) return
    for (const conversationId of joinedConversations) {
      await connection.invoke("JoinConversation", conversationId)
    }
  }

  function startWithRetry(handlers: ChatRealtimeHandlers) {
    if (disposed || !connection) return

    connection.start().then(
      () => {
        retryAttempt = 0
        void flushJoins()
      },
      (error: unknown) => {
        if (disposed) return

        console.error("[signalr] initial connect failed, will retry", error)

        const delay =
          INITIAL_CONNECT_RETRY_DELAYS_MS[
            Math.min(retryAttempt, INITIAL_CONNECT_RETRY_DELAYS_MS.length - 1)
          ]
        retryAttempt += 1

        retryTimer = setTimeout(() => {
          if (disposed) return
          connection = build(handlers)
          startWithRetry(handlers)
        }, delay)
      }
    )
  }

  return {
    connect(handlers) {
      disposed = false
      retryAttempt = 0
      connection = build(handlers)
      startWithRetry(handlers)
    },

    disconnect() {
      disposed = true
      if (retryTimer) clearTimeout(retryTimer)
      void connection?.stop()
      connection = null
      joinedConversations.clear()
    },

    joinConversation(conversationId) {
      joinedConversations.add(conversationId)
      if (connection?.state === signalR.HubConnectionState.Connected) {
        void connection.invoke("JoinConversation", conversationId)
      }
      // else: the next successful connect/reconnect's flushJoins picks it up.
    },

    leaveConversation(conversationId) {
      joinedConversations.delete(conversationId)
      if (connection?.state === signalR.HubConnectionState.Connected) {
        void connection.invoke("LeaveConversation", conversationId)
      }
    },
  }
}
