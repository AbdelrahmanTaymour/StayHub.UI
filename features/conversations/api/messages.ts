import { apiClient } from "@/lib/api/client"
import { SendMessageRequest } from "@/lib/api/types/conversations"

export async function getConversationMessages(id: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/conversations/{id}/messages",
    { params: { path: { id } } }
  )
  if (error) throw error
  return data
}

export async function sendMessage(id: string, body: SendMessageRequest) {
  const { data, error } = await apiClient.POST(
    "/api/v1/conversations/{id}/messages",
    { params: { path: { id } }, body }
  )
  if (error) throw error
  return data
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
