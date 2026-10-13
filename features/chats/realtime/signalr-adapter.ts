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
  let startPromise: Promise<void> | null = null
  let generation = 0
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  const joinedConversations = new Set<string>()

  function build(handlers: ChatRealtimeHandlers, myGeneration: number) {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: fetchAccessToken })
      .withAutomaticReconnect()
      .build()

    conn.on("InboxUpdated", () => {
      if (myGeneration !== generation) return
      handlers.onInboxShouldRefresh()
    })

    conn.on("ConversationUpdated", (conversationId: string) => {
      if (myGeneration !== generation) return
      handlers.onConversationShouldRefresh(conversationId)
    })

    conn.onreconnected(() => {
      if (myGeneration !== generation) return
      handlers.onInboxShouldRefresh()
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

  function startWithRetry(
    handlers: ChatRealtimeHandlers,
    myGeneration: number,
    attempt = 0
  ) {
    if (myGeneration !== generation || !connection) return

    const conn = connection
    const pending = conn.start()
    startPromise = pending

    pending.then(
      () => {
        if (myGeneration !== generation) return
        void flushJoins()
      },
      (error: unknown) => {
        if (myGeneration !== generation) return // superseded by a newer connect()/disconnect() — not a real failure to act on

        console.error("[signalr] initial connect failed, will retry", error)

        const delay =
          INITIAL_CONNECT_RETRY_DELAYS_MS[
            Math.min(attempt, INITIAL_CONNECT_RETRY_DELAYS_MS.length - 1)
          ]

        retryTimer = setTimeout(() => {
          if (myGeneration !== generation) return
          connection = build(handlers, myGeneration)
          startWithRetry(handlers, myGeneration, attempt + 1)
        }, delay)
      }
    )
  }

  return {
    connect(handlers) {
      generation += 1
      const myGeneration = generation
      connection = build(handlers, myGeneration)
      startWithRetry(handlers, myGeneration)
    },

    disconnect() {
      generation += 1
      if (retryTimer) clearTimeout(retryTimer)
      retryTimer = null

      const conn = connection
      const pending = startPromise
      connection = null
      startPromise = null
      joinedConversations.clear()

      if (!conn) return

      if (pending) {
        pending.catch(() => {}).finally(() => void conn.stop())
      } else {
        void conn.stop()
      }
    },

    joinConversation(conversationId) {
      joinedConversations.add(conversationId)
      if (connection?.state === signalR.HubConnectionState.Connected) {
        void connection.invoke("JoinConversation", conversationId)
      }
    },

    leaveConversation(conversationId) {
      joinedConversations.delete(conversationId)
      if (connection?.state === signalR.HubConnectionState.Connected) {
        void connection.invoke("LeaveConversation", conversationId)
      }
    },
  }
}
