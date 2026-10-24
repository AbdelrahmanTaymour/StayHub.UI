import type { NotificationType } from "@/lib/api/types/notifications"
import { parseNotificationPayload } from "./notification-payload"

export function getNotificationHref(
  type: NotificationType,
  payload: string | null | undefined
): string | null {
  const data = parseNotificationPayload(payload)

  switch (type) {
    case "BookingConfirmed":
    case "BookingRejected":
    case "BookingCancelled":
      return data.bookingId ? `/me/bookings/${data.bookingId}` : null
    case "NewMessage":
      return data.conversationId ? `/me/chats/${data.conversationId}` : null
    case "ReviewReceived":
      return data.apartmentId
        ? `/me/apartments/${data.apartmentId}/manage/reviews`
        : null
    case "ReviewResponseReceived":
      return null
    case "MaintenanceRequestCreated":
    case "MaintenanceRequestUpdate":
      return data.maintenanceRequestId
        ? `/me/apartments/maintenance-requests/${data.maintenanceRequestId}`
        : null
    case "ApartmentStaffAssignmentCreated":
      return data.apartmentId
        ? `/me/apartments/${data.apartmentId}/manage/staff`
        : null
    default:
      return null
  }
}

export function getNotificationMessage(
  payload: string | null | undefined,
  fallback: string
): string {
  const data = parseNotificationPayload(payload)
  return data.message ?? fallback
}
