"use client"

import { useEffect, useRef } from "react"

import { useMarkConversationRead } from "./useMarkConversationRead"

export function useMarkConversationReadOnActivity(
  conversationId: string | undefined,
  lastMessageId: string | undefined
) {
  const { mutate: markRead } = useMarkConversationRead()
  const markedUpToRef = useRef<string | undefined>(undefined)

  // Switching conversations resets what we've already marked read.
  useEffect(() => {
    markedUpToRef.current = undefined
  }, [conversationId])

  useEffect(() => {
    if (!conversationId || !lastMessageId) return
    if (markedUpToRef.current === lastMessageId) return

    function attemptMark() {
      if (document.visibilityState !== "visible") return
      markedUpToRef.current = lastMessageId
      markRead(conversationId as string)
    }

    attemptMark()

    if (document.visibilityState !== "visible") {
      document.addEventListener("visibilitychange", attemptMark)
      return () => document.removeEventListener("visibilitychange", attemptMark)
    }
  }, [conversationId, lastMessageId, markRead])
}
