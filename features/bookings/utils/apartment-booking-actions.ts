// features/bookings/utils/apartment-booking-actions.ts
import type { BookingStatus } from "@/lib/api/types/bookings"

export function getApartmentBookingActions(status: BookingStatus | undefined) {
  return {
    canConfirm: status === "Reserved",
    canReject: status === "Reserved",
    canViewOnly: status !== "Reserved",
  }
}
