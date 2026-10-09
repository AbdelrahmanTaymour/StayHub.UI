import type { PaymentStatus } from "@/lib/api/types/payments"

/**
 * Null means no payment has been initiated yet. Per product decision, both
 * "never started" and "Pending" display identically as "Unpaid" — the guest
 * doesn't need to distinguish "haven't tried" from "waiting on the bank."
 */
export type PaymentDisplayStatus = "Unpaid" | Exclude<PaymentStatus, "Pending">

export function getPaymentDisplayStatus(
  paymentStatus: PaymentStatus | null | undefined
): PaymentDisplayStatus {
  if (paymentStatus == null || paymentStatus === "Pending") return "Unpaid"
  return paymentStatus
}
