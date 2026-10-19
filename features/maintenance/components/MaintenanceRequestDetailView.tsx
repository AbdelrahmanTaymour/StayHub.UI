// features/maintenance/components/MaintenanceRequestDetailView.tsx
"use client"

import { useTranslations } from "next-intl"

import { StatusBadge } from "@/components/common/StatusBadge"
import { maintenanceStatusConfig } from "@/lib/status/status-config"
import { useMaintenanceRequest } from "@/features/maintenance/hooks/useMaintenanceRequest"
import { useApartmentStaffLazy } from "../hooks/useApartmentStaffLazy"
import { MaintenanceActionsPanel } from "./MaintenanceActionsPanel"
import { MaintenanceTimeline } from "./MaintenanceTimeline"
import { ReporterDossierCard } from "./ReporterDossierCard"
import { Skeleton } from "@/components/ui/skeleton"

export function MaintenanceRequestDetailView({
  requestId,
}: {
  requestId: string
}) {
  const t = useTranslations("apartmentManage.maintenanceDetail")
  const { data: request, isPending } = useMaintenanceRequest(requestId)

  // Only used to resolve the current assignee's display name/avatar from
  // their id — the detail endpoint returns assignedToUserId, not a name.
  const { data: staff } = useApartmentStaffLazy(
    request?.apartmentId ?? "",
    Boolean(request?.apartmentId)
  )
  const assignee = staff?.find(
    (member) => member.userId === request?.assignedToUserId
  )

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-96 w-full rounded-xl lg:col-span-8" />
        <Skeleton className="h-64 w-full rounded-xl lg:col-span-4" />
      </div>
    )
  }

  if (!request) return null

  const reporterName =
    [request.reporterFirstName, request.reporterLastName]
      .filter(Boolean)
      .join(" ") || t("unknownReporter")

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">
            {request.title ?? t("untitledTicket")}
          </h1>
          {request.apartmentName ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/70">
              {request.apartmentName}
              {request.apartmentCity ? (
                <span aria-hidden="true">• {request.apartmentCity}</span>
              ) : null}
            </p>
          ) : null}
        </div>
        {request.status ? (
          <StatusBadge
            status={request.status}
            config={maintenanceStatusConfig}
            namespace="maintenanceStatus"
          />
        ) : null}
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-semibold text-foreground">
              {t("description")}
            </h2>
            <p className="leading-relaxed text-foreground/70">
              {request.description ?? t("noDescription")}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-5 font-semibold text-foreground">
              {t("timelineTitle")}
            </h2>
            {request.status ? (
              <MaintenanceTimeline
                status={request.status}
                createdOnUtc={request.createdOnUtc}
                startOnUtc={request.startOnUtc}
                resolvedOnUtc={request.resolvedOnUtc}
                closedOnUtc={request.closedOnUtc}
                reporterName={reporterName}
                assigneeName={assignee?.fullName}
              />
            ) : null}
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-foreground">
              {t("actionsTitle")}
            </h2>
            {request.id && request.apartmentId && request.status ? (
              <MaintenanceActionsPanel
                requestId={request.id}
                apartmentId={request.apartmentId}
                status={request.status}
                closedOnUtc={request.closedOnUtc}
                currentAssigneeId={request.assignedToUserId}
              />
            ) : null}

            {assignee ? (
              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-1.5 text-sm font-medium text-foreground">
                  {t("currentAssignee")}
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {getInitials(assignee.fullName ?? "")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {assignee.fullName}
                    </p>
                    {assignee.role ? (
                      <p className="text-xs text-foreground/70">
                        {t(`reassignDialog.role.${assignee.role}`)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <ReporterDossierCard
            name={reporterName}
            email={request.reporterEmail}
            phoneNumber={request.reporterPhoneNumber}
            reporterUserId={request.reportedByUserId}
          />
        </div>
      </div>
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
