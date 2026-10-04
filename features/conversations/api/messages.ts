import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { SendMessageRequest } from "@/lib/api/types/conversations"

export async function getConversationMessages(id: string) {
  return unwrap(
    await apiClient.GET("/api/v1/conversations/{id}/messages", {
      params: { path: { id } },
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

/*
type SendMessageRequest = {
    body?: string | null;
}

// Responses

type GetConversationMessagesResponse = PagedResponse<ConversationMessagesResponse>
type ConversationMessagesResponse = {
    id?: string; // uuid
    senderId?: string; // uuid
    body?: string | null;
    sentOnUtc?: string; // date-time
    readOnUtc?: string | null; // date-time
}
type PagedResponse<T> = {
    items: T[] | null;
    page?: number; // int32
    pageSize?: number; // int32
    totalCount?: number; // int32
    totalPages?: number; // int32
}

type SendMessageResponse = string // new message id (uuid)
*/
