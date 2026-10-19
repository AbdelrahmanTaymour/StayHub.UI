"use client"

import { Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "cn"
import type { MaintenanceRequestStatus } from "@/lib/api/types/maintenance"

const STAGE_ORDER: MaintenanceRequestStatus[] = [
  "Open",
  "InProgress",
  "Resolved",
  "Closed",
]

interface MaintenanceTimelineProps {
  status: MaintenanceRequestStatus
  createdOnUtc?: string
  startOnUtc?: string | null
  resolvedOnUtc?: string | null
  closedOnUtc?: string | null
  reporterName: string
  assigneeName?: string | null
}

export function MaintenanceTimeline({
  status,
  createdOnUtc,
  startOnUtc,
  resolvedOnUtc,
  closedOnUtc,
  reporterName,
  assigneeName,
}: MaintenanceTimelineProps) {
  const t = useTranslations("apartmentManage.maintenanceDetail.timeline")
  const locale = useLocale()

  const timestamps: Record<
    MaintenanceRequestStatus,
    string | null | undefined
  > = {
    Open: createdOnUtc,
    InProgress: startOnUtc,
    Resolved: resolvedOnUtc,
    Closed: closedOnUtc,
  }

  const currentIndex = STAGE_ORDER.indexOf(status)
  const isClosed = status === "Closed"

  return (
    <div className="relative ps-6">
      <div
        aria-hidden="true"
        className="absolute inset-y-2 inset-s-2 w-0.5 bg-border"
      />
      <ol className="flex flex-col gap-6">
        {STAGE_ORDER.map((stage, i) => {
          const state = isClosed
            ? "done"
            : i < currentIndex
              ? "done"
              : i === currentIndex
                ? "current"
                : "upcoming"
          const timestamp = timestamps[stage]

          return (
            <li key={stage} className="relative flex items-start gap-4">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -inset-s-6 top-1 flex size-4 items-center justify-center rounded-full",
                  state === "done" && "bg-primary ring-4 ring-card",
                  state === "current" &&
                    "bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950",
                  state === "upcoming" && "bg-muted ring-4 ring-card"
                )}
              >
                {state === "done" ? (
                  <Check className="size-2.5 text-primary-foreground" />
                ) : null}
                {state === "current" ? (
                  <span className="size-1.5 animate-ping rounded-full bg-background" />
                ) : null}
              </span>

              <div
                className={cn(
                  "flex-1 rounded-lg p-3",
                  state === "current"
                    ? "bg-amber-50/60 dark:bg-amber-950/40"
                    : "bg-muted",
                  state === "upcoming" && "opacity-60"
                )}
              >
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        state === "current"
                          ? "text-amber-900 dark:text-amber-200"
                          : "text-foreground"
                      )}
                    >
                      {t(`stage.${stage}`)}
                    </span>
                    {state === "current" ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        {t("currentStage")}
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono text-xs text-foreground/70">
                    {timestamp
                      ? formatTimestamp(timestamp, locale)
                      : state === "upcoming"
                        ? t("upcoming")
                        : t("inProgress")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/70">
                  {t(`description.${stage}.${state}`, {
                    reporter: reporterName,
                    assignee: assigneeName ?? t("unassigned"),
                  })}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function formatTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}
