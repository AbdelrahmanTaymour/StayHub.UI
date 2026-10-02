import { BookingStatus } from "../api/types/bookings"
import { MaintenanceRequestStatus } from "../api/types/maintenance"
import { PaymentStatus } from "../api/types/payments"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface StatusConfig {
  label: string
  variant: BadgeVariant
}

export const bookingStatusConfig: Record<BookingStatus, StatusConfig> = {
  Reserved: { label: "reserved", variant: "secondary" },
  Confirmed: { label: "confirmed", variant: "default" },
  Rejected: { label: "rejected", variant: "destructive" },
  Cancelled: { label: "cancelled", variant: "outline" },
  Completed: { label: "completed", variant: "secondary" },
}

export const maintenanceStatusConfig: Record<
  MaintenanceRequestStatus,
  StatusConfig
> = {
  Open: { label: "open", variant: "destructive" },
  InProgress: { label: "inProgress", variant: "default" },
  Resolved: { label: "resolved", variant: "secondary" },
  Closed: { label: "closed", variant: "outline" },
}

export const paymentStatusConfig: Record<PaymentStatus, StatusConfig> = {
  Pending: { label: "pending", variant: "secondary" },
  Succeeded: { label: "succeeded", variant: "default" },
  Failed: { label: "failed", variant: "destructive" },
  Refunded: { label: "refunded", variant: "outline" },
}
