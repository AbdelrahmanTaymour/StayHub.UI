import "server-only"

import { cache } from "react"

import { apiClient } from "@/lib/api/client"
import { ApiError, unwrap } from "@/lib/errors/api-error"
import { GetConversationMessagesQuery } from "@/lib/api/types/conversations"

export const getMyConversationsServer = cache(async () => {
  return unwrap(await apiClient.GET("/api/v1/conversations"))
})

export async function getConversationMessagesServer(
  id: string,
  query?: GetConversationMessagesQuery
) {
  try {
    return await unwrap(
      await apiClient.GET("/api/v1/conversations/{id}/messages", {
        params: { path: { id }, query },
      })
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}
