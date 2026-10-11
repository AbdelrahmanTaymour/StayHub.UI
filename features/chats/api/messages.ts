import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import {
  GetConversationMessagesQuery,
  SendMessageRequest,
} from "@/lib/api/types/conversations"

export async function getConversationMessages(
  id: string,
  query?: GetConversationMessagesQuery
) {
  return unwrap(
    await apiClient.GET("/api/v1/conversations/{id}/messages", {
      params: { path: { id }, query },
    })
  )
}

export async function sendMessage(id: string, body: SendMessageRequest) {
  return unwrap(
    await apiClient.POST("/api/v1/conversations/{id}/messages", {
      params: { path: { id } },
      body,
    })
  )
}
