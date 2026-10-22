// features/notifications/utils/notification-target.ts
import type { NotificationType } from "@/lib/api/types/notifications"
import {
  parseNotificationPayload,
  type ParsedNotificationPayload,
} from "./notification-payload"

/**
 * Resolves where clicking a notification should navigate. Returns null
 * when no sensible destination exists (e.g. ReviewResponseReceived's
 * payload has no apartmentId to link to) — callers render those rows as
 * non-interactive instead of a dead or wrong link.
 */
export function getNotificationHref(
  type: NotificationType,
  payload: string | null | undefined
): string | null {
  switch (type) {
    case "BookingConfirmed":
    case "BookingRejected":
    case "BookingCancelled": {
      const data = parseNotificationPayload(
        type,
        payload
      ) as ParsedNotificationPayload<typeof type> | null
      return data ? `/me/bookings/${data.bookingId}` : null
    }
    case "NewMessage": {
      const data = parseNotificationPayload(type, payload)
      return data ? `/me/chats/${data.conversationId}` : null
    }
    case "ReviewReceived": {
      const data = parseNotificationPayload(type, payload)
      return data ? `/me/apartments/${data.apartmentId}/manage/reviews` : null
    }
    case "ReviewResponseReceived":
      const data = parseNotificationPayload(type, payload)
      return data ? `/apartments/${data.apartmentId}` : null
    case "MaintenanceRequestCreated": {
      const data = parseNotificationPayload(type, payload)
      return data
        ? `/me/apartments/maintenance-requests/${data.maintenanceRequestId}`
        : null
    }
    case "MaintenanceRequestUpdate": {
      const data = parseNotificationPayload(type, payload)
      return data
        ? `/me/apartments/maintenance-requests/${data.maintenanceRequestId}`
        : null
    }
    case "ApartmentStaffAssignmentCreated": {
      const data = parseNotificationPayload(type, payload)
      return data ? `/me/apartments/${data.apartmentId}/manage/staff` : null
    }
    default:
      return null
  }
}

/** Extracts the display message, falling back to a generic string if the payload didn't parse. */
export function getNotificationMessage(
  type: NotificationType,
  payload: string | null | undefined,
  fallback: string
): string {
  const data = parseNotificationPayload(type, payload)
  return data?.message ?? fallback
}
