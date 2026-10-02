import { apiClient } from "@/lib/api/client"
import { QueryParameters } from "@/lib/api/type-utils"

type GetNotificationsQuery = QueryParameters<"/api/v1/notifications", "get">

export async function getMyNotifications(query?: GetNotificationsQuery) {
  const { data, error } = await apiClient.GET("/api/v1/notifications", {
    params: { query },
  })
  if (error) throw error
  return data
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await apiClient.POST(
    "/api/v1/notifications/{notificationId}/read",
    { params: { path: { notificationId } } }
  )
  if (error) throw error
}

/*
type GetNotificationsQuery = {
    unreadOnly?: boolean; // when true, only return notifications not yet read
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}

type NotificationType =
    | "BookingConfirmed"
    | "BookingRejected"
    | "BookingCancelled"
    | "NewMessage"
    | "ReviewReceived"
    | "ReviewResponseReceived"
    | "MaintenanceRequestCreated"
    | "MaintenanceRequestUpdate"
    | "ApartmentStaffAssignmentCreated"
// `type` tells you which event fired; `payload` (below) holds event-specific
// data as a backend-serialized string (shape depends on `type` — not
// strongly typed in the generated spec).

// Responses

type GetMyNotificationsResponse = PagedResponse<MyNotificationsResponse>
type MyNotificationsResponse = {
    id?: string; // uuid
    type?: NotificationType;
    payload?: string | null;
    isRead?: boolean;
    createdOnUtc?: string; // date-time
}
type PagedResponse<T> = {
    items: T[] | null;
    page?: number; // int32
    pageSize?: number; // int32
    totalCount?: number; // int32
    totalPages?: number; // int32
}

type MarkNotificationReadResponse = void // 204 No Content
*/
