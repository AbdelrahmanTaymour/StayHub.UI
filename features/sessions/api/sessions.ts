import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"

export async function getUserSessions(id: string) {
  const { data, error } = await apiClient.GET("/api/v1/users/{id}/sessions", {
    params: { path: { id } },
  })
  if (error) throw error
  return data
}

export async function revokeSession(sessionId: string) {
  const { error } = await apiClient.DELETE(
    "/api/v1/users/sessions/{sessionId}",
    {
      params: { path: { sessionId } },
    }
  )
  if (error) throw error
}

/*
// Responses

type GetUserSessionsResponse = UserSessionResponse[]
type UserSessionResponse = {
    id?: string; // uuid
    deviceInfo?: string | null;
    ipAddress?: string | null;
    createdOnUtc?: string; // date-time
    lastSeenOnUtc?: string; // date-time
}

type RevokeSessionResponse = void // 204 No Content
*/
