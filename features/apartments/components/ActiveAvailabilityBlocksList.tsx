"use client"

import { format } from "date-fns"
import { CalendarOff, UserX, Wrench } from "lucide-react"
import { useTranslations } from "next-intl"

import { EmptyState } from "@/components/feedback/EmptyState"
import {
  nightsBetween,
  toDateOnly,
} from "@/features/apartments/utils/availability"
import { AvailabilityBlockResponse } from "@/lib/api/types/apartments"

interface ActiveAvailabilityBlocksListProps {
  blocks: AvailabilityBlockResponse[]
  onSelect: (block: AvailabilityBlockResponse) => void
}

export function ActiveAvailabilityBlocksList({
  blocks,
  onSelect,
}: ActiveAvailabilityBlocksListProps) {
  const t = useTranslations("apartmentManage.availability")

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-foreground">
          {t("activeBlocksTitle")}
        </h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-tertiary">
          {t("recordsCount", { count: blocks.length })}
        </span>
      </div>

      {blocks.length === 0 ? (
        <EmptyState
          icon={<CalendarOff className="size-8" />}
          title={t("noBlocksTitle")}
          description={t("noBlocksDescription")}
          className="border-0 py-8"
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {blocks.map((block) => {
            if (!block.startDate || !block.endDate) return null
            const start = toDateOnly(block.startDate)
            const end = toDateOnly(block.endDate)
            const nights = nightsBetween(start, end)
            const isMaintenance = block.reason === "UnderMaintenance"

            return (
              <li key={block.id}>
                <button
                  type="button"
                  onClick={() => onSelect(block)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg bg-muted p-3 text-start transition-colors hover:bg-muted/70"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card text-tertiary shadow-sm"
                    >
                      {isMaintenance ? (
                        <Wrench className="size-4" />
                      ) : (
                        <UserX className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {format(start, "MMM d")} – {format(end, "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-foreground/70">
                        {t("nights", { count: nights })} ·{" "}
                        {isMaintenance
                          ? t("reason.UnderMaintenance")
                          : t("reason.OwnerBlocked")}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
