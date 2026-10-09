import type { BookingStatus } from "@/lib/api/types/bookings"
import type { PaymentStatus } from "@/lib/api/types/payments"

export interface BookingActionContext {
  status?: BookingStatus
  canCancel?: boolean
  paymentStatus?: PaymentStatus | null
  hasReview?: boolean
}

export function getBookingActions(ctx: BookingActionContext) {
  const { status, canCancel, paymentStatus, hasReview } = ctx

  const canPay =
    status === "Confirmed" &&
    paymentStatus !== "Succeeded" &&
    paymentStatus !== "Pending"
  const canCancelBooking = Boolean(canCancel)
  const canReview = status === "Completed" && !hasReview

  return { canPay, canCancelBooking, canReview }
}
