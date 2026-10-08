import { BookingStatus } from "../api/types/bookings"
import { MaintenanceRequestStatus } from "../api/types/maintenance"
import { PaymentStatus } from "../api/types/payments"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"
/** Maps to a fixed color scale in StatusBadge, independent of the shadcn Badge variant. */
export type StatusTone =
  "success" | "warning" | "destructive" | "neutral" | "info"

interface StatusConfig {
  label: string
  variant: BadgeVariant
  tone: StatusTone
}

export const bookingStatusConfig: Record<BookingStatus, StatusConfig> = {
  Reserved: { label: "reserved", variant: "secondary", tone: "warning" },
  Confirmed: { label: "confirmed", variant: "default", tone: "success" },
  Rejected: { label: "rejected", variant: "destructive", tone: "destructive" },
  Cancelled: { label: "cancelled", variant: "outline", tone: "destructive" },
  Completed: { label: "completed", variant: "secondary", tone: "neutral" },
}

export const maintenanceStatusConfig: Record<
  MaintenanceRequestStatus,
  StatusConfig
> = {
  Open: { label: "open", variant: "destructive", tone: "destructive" },
  InProgress: { label: "inProgress", variant: "default", tone: "info" },
  Resolved: { label: "resolved", variant: "secondary", tone: "success" },
  Closed: { label: "closed", variant: "outline", tone: "neutral" },
}

export const paymentStatusConfig: Record<PaymentStatus, StatusConfig> = {
  Pending: { label: "pending", variant: "secondary", tone: "warning" },
  Succeeded: { label: "succeeded", variant: "default", tone: "success" },
  Failed: { label: "failed", variant: "destructive", tone: "destructive" },
  Refunded: { label: "refunded", variant: "outline", tone: "info" },
}
