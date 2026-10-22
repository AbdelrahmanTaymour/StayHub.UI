import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { QueryParameters } from "@/lib/api/type-utils"

type GetNotificationsQuery = QueryParameters<"/api/v1/notifications", "get">

export async function getMyNotifications(query?: GetNotificationsQuery) {
  return unwrap(
    await apiClient.GET("/api/v1/notifications", {
      params: { query },
    })
  )
}

export async function getUnreadNotificationsCount() {
  return unwrap(await apiClient.GET("/api/v1/notifications/count"))
}

export async function markNotificationRead(notificationId: string) {
  return unwrap(
    await apiClient.POST("/api/v1/notifications/{notificationId}/read", {
      params: { path: { notificationId } },
    })
  )
}
