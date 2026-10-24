import type { NotificationType } from "@/lib/api/types/notifications"

/** Short header shown above each notification's message — translation keys, resolved via t() in the component. */
export const NOTIFICATION_HEADER_KEYS: Record<NotificationType, string> = {
  BookingConfirmed: "headers.bookingConfirmed",
  BookingRejected: "headers.bookingRejected",
  BookingCancelled: "headers.bookingCancelled",
  NewMessage: "headers.newMessage",
  ReviewReceived: "headers.reviewReceived",
  ReviewResponseReceived: "headers.reviewResponseReceived",
  MaintenanceRequestCreated: "headers.maintenanceRequestCreated",
  MaintenanceRequestUpdate: "headers.maintenanceRequestUpdate",
  ApartmentStaffAssignmentCreated: "headers.staffAssignmentCreated",
  ApartmentStaffAssignmentRoleChanged: "headers.staffAssignmentRoleChanged",
}
