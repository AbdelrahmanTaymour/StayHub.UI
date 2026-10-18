"use client"

import { ChevronRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { buttonVariants } from "@/components/ui/button"
import { MaintenanceRequestsResponse } from "@/lib/api/types/maintenance"
import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge"
import { formatDate } from "@/features/apartments/utils/format-date"

export function ApartmentMaintenanceTable({
  requests,
}: {
  requests: MaintenanceRequestsResponse[]
}) {
  const t = useTranslations("apartmentManage.maintenance")

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-foreground/70">
        {t("emptyTitle")}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-start">
        <thead>
          <tr className="h-10 bg-muted text-xs font-medium tracking-wider text-foreground/70 uppercase">
            <th className="px-4 py-2 text-start">{t("colTitle")}</th>
            <th className="px-4 py-2 text-start">{t("colStatus")}</th>
            <th className="px-4 py-2 text-start">{t("colCreated")}</th>
            <th className="px-4 py-2 text-start">{t("colReporter")}</th>
            <th className="px-4 py-2 pe-4 text-end">{t("colAction")}</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <MaintenanceRow key={request.id} request={request} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MaintenanceRow({ request }: { request: MaintenanceRequestsResponse }) {
  const t = useTranslations("apartmentManage.maintenance")
  const locale = useLocale()

  const reporterName =
    [request.reporterFirstName, request.reporterLastName]
      .filter(Boolean)
      .join(" ") || t("unknownReporter")

  return (
    <tr className="h-17 border-t border-border transition-colors hover:bg-muted/40">
      <td className="px-4 py-3">
        {request.id ? (
          <Link
            href={`/me/apartments/maintenance-requests/${request.id}`}
            className="font-medium text-foreground hover:text-tertiary hover:underline"
          >
            {request.title ?? t("untitledTicket")}
          </Link>
        ) : (
          <span className="font-medium text-foreground">
            {request.title ?? t("untitledTicket")}
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        {request.status ? (
          <MaintenanceStatusBadge status={request.status} />
        ) : null}
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col">
          {request.createdOnUtc ? (
            <>
              <span className="text-sm text-foreground">
                {formatDate(request.createdOnUtc, locale)}
              </span>
              <span className="text-xs text-foreground/70">
                {formatRelative(request.createdOnUtc, locale, t)}
              </span>
            </>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
            {getInitials(reporterName)}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {reporterName}
            </span>
            <span className="text-xs text-foreground/70">
              {request.isReportedByOwner
                ? t("reportedByOwner")
                : t("reportedByGuest")}
            </span>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 pe-4 text-end">
        {request.id ? (
          <Link
            href={`/me/apartments/maintenance-requests/${request.id}`}
            className={buttonVariants({ size: "sm", className: "gap-1" })}
          >
            {t("manageTicket")}
            <ChevronRight
              aria-hidden="true"
              className="size-4 rtl:rotate-180"
            />
          </Link>
        ) : null}
      </td>
    </tr>
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

function formatRelative(
  value: string,
  locale: string,
  t: ReturnType<typeof useTranslations<"apartmentManage.maintenance">>
) {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffDays = Math.floor(diffMs / 86_400_000)
  if (diffDays <= 0) return t("today")
  if (diffDays === 1) return t("yesterday")
  return t("daysAgo", { count: diffDays })
}
