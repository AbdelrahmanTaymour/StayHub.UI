// features/maintenance/components/MaintenanceActionsPanel.tsx
"use client"

import { Archive, Loader2, UserRoundSearch, Wrench } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  useCloseMaintenanceRequest,
  useResolveMaintenanceRequest,
  useStartMaintenanceRequest,
} from "@/features/maintenance/hooks/useMaintenanceRequestTransitions"
import type { MaintenanceRequestStatus } from "@/lib/api/types/maintenance"
import { ReassignStaffDialog } from "./ReassignStaffDialog"

interface MaintenanceActionsPanelProps {
  requestId: string
  apartmentId: string
  status: MaintenanceRequestStatus
  closedOnUtc?: string | null
  currentAssigneeId?: string | null
}

export function MaintenanceActionsPanel({
  requestId,
  apartmentId,
  status,
  closedOnUtc,
  currentAssigneeId,
}: MaintenanceActionsPanelProps) {
  const t = useTranslations("apartmentManage.maintenanceDetail.actions")
  const [isReassignOpen, setIsReassignOpen] = useState(false)

  const { mutate: start, isPending: isStarting } = useStartMaintenanceRequest(
    requestId,
    apartmentId
  )
  const { mutate: resolve, isPending: isResolving } =
    useResolveMaintenanceRequest(requestId, apartmentId)
  const { mutate: close, isPending: isClosing } = useCloseMaintenanceRequest(
    requestId,
    apartmentId
  )

  const isPending = isStarting || isResolving || isClosing
  const canReassign = status === "Open" || status === "InProgress"

  return (
    <div className="flex flex-col gap-3">
      {status === "Open" ? (
        <Button
          type="button"
          className="w-full gap-2"
          disabled={isPending}
          onClick={() => start(undefined)}
        >
          {isStarting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Wrench className="size-4" />
          )}
          {t("startProgress")}
        </Button>
      ) : null}

      {status === "InProgress" ? (
        <Button
          type="button"
          className="w-full gap-2"
          disabled={isPending}
          onClick={() => resolve(undefined)}
        >
          {isResolving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Wrench className="size-4" />
          )}
          {t("markResolved")}
        </Button>
      ) : null}

      {status === "Resolved" ? (
        <Button
          type="button"
          className="w-full gap-2"
          disabled={isPending}
          onClick={() => close(undefined)}
        >
          {isClosing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Archive className="size-4" />
          )}
          {t("closeTicket")}
        </Button>
      ) : null}

      {status === "Closed" ? (
        <Button
          type="button"
          variant="secondary"
          disabled
          className="w-full gap-2"
        >
          <Archive className="size-4" />
          {closedOnUtc
            ? t("closedOn", { date: formatDateOnly(closedOnUtc) })
            : t("closedLabel")}
        </Button>
      ) : null}

      {canReassign ? (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={isPending}
          onClick={() => setIsReassignOpen(true)}
        >
          <UserRoundSearch className="size-4 text-foreground/70" />
          {t("reassign")}
        </Button>
      ) : null}

      <ReassignStaffDialog
        open={isReassignOpen}
        onOpenChange={setIsReassignOpen}
        requestId={requestId}
        apartmentId={apartmentId}
        currentAssigneeId={currentAssigneeId}
      />
    </div>
  )
}

function formatDateOnly(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
  }).format(new Date(value))
}
