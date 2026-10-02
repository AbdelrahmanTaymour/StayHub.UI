import { StatusBadge } from "@/components/common/StatusBadge"
import { MaintenanceRequestStatus } from "@/lib/api/types/maintenance"
import { maintenanceStatusConfig } from "@/lib/status/status-config"

export function MaintenanceStatusBadge({
  status,
}: {
  status: MaintenanceRequestStatus
}) {
  return (
    <StatusBadge
      status={status}
      config={maintenanceStatusConfig}
      namespace="maintenanceStatus"
    />
  )
}
