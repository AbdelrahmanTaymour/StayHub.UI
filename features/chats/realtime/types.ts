/**
 * Transport-agnostic contract for live chat updates.
 *
 * Nothing outside this folder should know whether updates arrive via
 * polling or a push connection. Every consumer (RealtimeProvider,
 * useJoinConversation) only ever talks to this interface, so swapping the
 * adapter wired in RealtimeProvider.tsx is the only change needed once a
 * SignalR hub exists — delete polling-adapter.ts, add
 * signalr-adapter.ts implementing ChatRealtimeAdapter, done.
 *
 * Events are deliberately coarse ("something about this conversation
 * changed") rather than "here is the new message" — that's what a
 * SignalR hub naturally pushes (a signal to refetch, not necessarily the
 * full payload), and it's what the polling adapter can honestly provide
 * today without pretending to know more than "go check again".
 */
export interface ChatRealtimeHandlers {
  /** The caller's conversation list may be stale — refetch it. */
  onInboxShouldRefresh: () => void
  /** The given conversation has new activity — refetch its messages. */
  onConversationShouldRefresh: (conversationId: string) => void
}

export interface ChatRealtimeAdapter {
  /** Called once, when ChatRealtimeProvider mounts. Connect / start polling here. */
  connect(handlers: ChatRealtimeHandlers): void
  /** Called once, when ChatRealtimeProvider unmounts. Tear everything down. */
  disconnect(): void
  /** The user opened this conversation — subscribe to it specifically (e.g. join its SignalR group). */
  joinConversation(conversationId: string): void
  /** The user navigated away from that conversation — unsubscribe. */
  leaveConversation(conversationId: string): void
}
