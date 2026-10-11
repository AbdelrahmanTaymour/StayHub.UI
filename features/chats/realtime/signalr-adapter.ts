"use client"

import * as signalR from "@microsoft/signalr"

import type { ChatRealtimeAdapter, ChatRealtimeHandlers } from "./types"

// TODO: confirm this matches your actual API base URL env var.
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

/**
 * Real implementation of ChatRealtimeAdapter, backed by the ConversationHub
 * SignalR hub. Event names ("InboxUpdated", "ConversationUpdated") must
 * match SignalRConversationNotifier's SendAsync calls on the backend
 * exactly — they're plain strings on both sides, nothing enforces that at
 * compile time.
 *
 * KNOWN LIMITATION, not solved here: accessTokenFactory is called on
 * initial connect and on every automatic-reconnect attempt, but NOT
 * mid-connection — so if the access token expires while the WebSocket
 * stays open the whole time (no network blip to trigger a reconnect), the
 * Hub doesn't re-validate it (JWT bearer auth happens at the handshake,
 * not per message). Flagging rather than guessing you want a proactive
 * recycle timer by default.
 */
export function createSignalRAdapter(): ChatRealtimeAdapter {
  let connection: signalR.HubConnection | null = null
  let disposed = false
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let retryAttempt = 0
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
      retryAttempt = 0 // a successful reconnect resets the initial-connect backoff too
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

  // withAutomaticReconnect() only covers a connection that succeeded at
  // least once — a failed *initial* negotiation (e.g. the token endpoint
  // blipped, or the backend wasn't up yet) just rejects start() and stops
  // there on its own. Without this, that single failure permanently kills
  // realtime for the session (no fallback, no retry) until a manual page
  // refresh — which is exactly the "must refresh to see updates" symptom.
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
          // A fresh HubConnection is required after a failed start() — the
          // old one is unusable, rebuild rather than retry the same instance.
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
