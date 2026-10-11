import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { StartConversationRequest } from "@/lib/api/types/conversations"

export async function getMyConversations() {
  return unwrap(await apiClient.GET("/api/v1/conversations"))
}

export async function startConversation(body: StartConversationRequest) {
  return unwrap(
    await apiClient.POST("/api/v1/conversations", {
      body,
    })
  )
}

export async function markConversationRead(id: string) {
  return unwrap(
    await apiClient.POST("/api/v1/conversations/{id}/read", {
      params: { path: { id } },
    })
  )
}
