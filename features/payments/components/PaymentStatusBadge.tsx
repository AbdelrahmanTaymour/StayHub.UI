import { StatusBadge } from "@/components/common/StatusBadge"
import { PaymentStatus } from "@/lib/api/types/payments"
import { paymentStatusConfig } from "@/lib/status/status-config"

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <StatusBadge
      status={status}
      config={paymentStatusConfig}
      namespace="paymentStatus"
    />
  )
}
