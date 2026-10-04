import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"

export async function getUserSessions(id: string) {
  return unwrap(
    await apiClient.GET("/api/v1/users/{id}/sessions", {
      params: { path: { id } },
    })
  )
}

export async function revokeSession(sessionId: string) {
  return unwrap(
    await apiClient.DELETE("/api/v1/users/sessions/{sessionId}", {
      params: { path: { sessionId } },
    })
  )
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
