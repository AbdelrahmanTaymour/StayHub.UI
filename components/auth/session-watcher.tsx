"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { signOut } from "next-auth/react"

import { useAuth } from "@/providers/AuthContext"

/**
 * Keeps client state consistent with the server session:
 * - Resets the query cache when the signed-in user changes, so one user's
 *   cached data (including isFavorited) never shows for another.
 * - Signs out when the refresh token is no longer valid.
 */
export function SessionWatcher() {
  const { session } = useAuth()
  const queryClient = useQueryClient()
  const userId = session?.user?.id
  const previousUserId = React.useRef(userId)

  React.useEffect(() => {
    if (previousUserId.current !== userId) {
      previousUserId.current = userId
      void queryClient.resetQueries()
    }
  }, [userId, queryClient])

  React.useEffect(() => {
    if (session?.error) {
      queryClient.clear()
      void signOut({ callbackUrl: "/" })
    }
  }, [session?.error, queryClient])

  return null
}
