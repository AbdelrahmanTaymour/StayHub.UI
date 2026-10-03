import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { StartConversationRequest } from "@/lib/api/types/conversations"

export async function getMyConversations() {
  const { data, error } = await apiClient.GET("/api/v1/conversations")
  if (error) throw error
  return data
}

export async function startConversation(body: StartConversationRequest) {
  const { data, error } = await apiClient.POST("/api/v1/conversations", {
    body,
  })
  if (error) throw error
  return data
}

export async function markConversationRead(id: string) {
  const { error } = await apiClient.POST("/api/v1/conversations/{id}/read", {
    params: { path: { id } },
  })
  if (error) throw error
}

/*
type StartConversationRequest = {
    apartmentId?: string; // uuid
    bookingId?: string | null; // uuid
    initialMessage?: string | null;
}

type ConversationRole = "Host" | "Guest"
// Describes the OTHER party in the conversation relative to the caller:
// Host: the other party is the apartment's owner/host
// Guest: the other party is the guest/booker

// Responses

type GetMyConversationsResponse = MyConversationResponse[]
type MyConversationResponse = {
    id?: string; // uuid
    apartmentId?: string; // uuid
    apartmentName?: string | null;
    otherPartyId?: string; // uuid
    otherPartyName?: string | null;
    otherPartyAvatarUrl?: string | null;
    otherPartyRole?: ConversationRole;
    lastMessagePreview?: string | null;
    lastMessageOnUtc?: string | null; // date-time
    unreadCount?: number; // int32
}

type StartConversationResponse = string // new conversation id (uuid)

type MarkConversationReadResponse = void // 204 No Content
*/
