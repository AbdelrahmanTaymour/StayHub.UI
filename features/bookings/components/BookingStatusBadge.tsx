import { StatusBadge } from "@/components/common/StatusBadge"
import { BookingStatus } from "@/lib/api/types/bookings"
import { bookingStatusConfig } from "@/lib/status/status-config"

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <StatusBadge
      status={status}
      config={bookingStatusConfig}
      namespace="bookingStatus"
    />
  )
}
