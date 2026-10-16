"use client"

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"
import {
  AvailabilityBlockResponse,
  BookedRangeResponse,
} from "@/lib/api/types/apartments"
import { getDayStatus } from "../utils/availability"

interface AvailabilityCalendarProps {
  blocks: AvailabilityBlockResponse[]
  bookedRanges: BookedRangeResponse[]
  selectedStart: Date | null
  selectedEnd: Date | null
  onDayClick: (date: Date) => void
  onBlockClick: (block: AvailabilityBlockResponse) => void
}

const WEEKDAY_INDEXES = [0, 1, 2, 3, 4, 5, 6]

export function AvailabilityCalendar({
  blocks,
  bookedRanges,
  selectedStart,
  selectedEnd,
  onDayClick,
  onBlockClick,
}: AvailabilityCalendarProps) {
  const t = useTranslations("apartmentManage.availability")
  const locale = useLocale()
  const dateLocale = locale === "ar" ? ar : enUS
  const today = useMemo(() => new Date(), [])

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(today))

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { locale: dateLocale })
    const end = endOfWeek(endOfMonth(viewMonth), { locale: dateLocale })
    return eachDayOfInterval({ start, end })
  }, [viewMonth, dateLocale])

  const weekdayLabels = useMemo(() => {
    const base = startOfWeek(today, { locale: dateLocale })
    return WEEKDAY_INDEXES.map((offset) =>
      format(addDaysLocal(base, offset), "EEEEE", { locale: dateLocale })
    )
  }, [today, dateLocale])

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border p-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("previousMonth")}
          onClick={() => setViewMonth((d) => subMonths(d, 1))}
        >
          <ChevronLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="min-w-32 text-center font-semibold text-foreground">
            {format(viewMonth, "MMMM yyyy", { locale: dateLocale })}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewMonth(startOfMonth(today))}
          >
            {t("today")}
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("nextMonth")}
          onClick={() => setViewMonth((d) => addMonths(d, 1))}
        >
          <ChevronRight aria-hidden="true" className="size-5 rtl:rotate-180" />
        </Button>
      </div>

      <div className="bg-muted/60 px-4 py-2 text-sm text-foreground/70">
        {selectedStart && !selectedEnd ? t("hintPickEnd") : t("hintPickStart")}
      </div>

      <div aria-label={t("calendarLabel")} className="p-2 sm:p-3">
        <div className="grid grid-cols-7 text-center text-xs font-medium text-foreground/70">
          {weekdayLabels.map((label, i) => (
            <span key={i} className="py-2 uppercase">
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <DayCell
              key={day.toISOString()}
              day={day}
              inMonth={isSameMonth(day, viewMonth)}
              today={today}
              blocks={blocks}
              bookedRanges={bookedRanges}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              onDayClick={onDayClick}
              onBlockClick={onBlockClick}
            />
          ))}
        </div>
      </div>

      <Legend />
    </div>
  )
}

function addDaysLocal(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

interface DayCellProps {
  day: Date
  inMonth: boolean
  today: Date
  blocks: AvailabilityBlockResponse[]
  bookedRanges: BookedRangeResponse[]
  selectedStart: Date | null
  selectedEnd: Date | null
  onDayClick: (date: Date) => void
  onBlockClick: (block: AvailabilityBlockResponse) => void
}

function DayCell({
  day,
  inMonth,
  today,
  blocks,
  bookedRanges,
  selectedStart,
  selectedEnd,
  onDayClick,
  onBlockClick,
}: DayCellProps) {
  const t = useTranslations("apartmentManage.availability")
  const info = getDayStatus(day, blocks, bookedRanges, today)

  const isPendingEdge =
    (selectedStart && isSameDay(day, selectedStart)) ||
    (selectedEnd && isSameDay(day, selectedEnd))
  const isPendingInRange =
    selectedStart &&
    selectedEnd &&
    isWithinInterval(day, { start: selectedStart, end: selectedEnd })

  const isInteractive =
    inMonth && (info.status === "available" || info.status === "blocked")

  function handleClick() {
    if (!inMonth) return
    if (info.status === "available") onDayClick(day)
    if (info.status === "blocked") onBlockClick(info.block)
  }

  const label = [
    format(day, "PPPP"),
    info.status === "past" && t("statusPast"),
    info.status === "booked" && t("statusBooked"),
    info.status === "blocked" &&
      (info.block.reason === "UnderMaintenance"
        ? t("statusMaintenance")
        : t("statusOwnerBlocked")),
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <button
      type="button"
      disabled={!isInteractive}
      aria-label={label}
      aria-current={isToday(day) ? "date" : undefined}
      onClick={handleClick}
      tabIndex={inMonth ? 0 : -1}
      className={cn(
        "relative flex h-16 flex-col items-center justify-center gap-0.5 rounded-lg text-sm transition-colors select-none sm:h-20",
        !inMonth && "pointer-events-none opacity-0",
        isToday(day) && "ring-2 ring-primary ring-offset-1 ring-offset-card",
        info.status === "past" && "bg-muted text-foreground/40",
        info.status === "booked" &&
          "cursor-not-allowed bg-tertiary/20 text-tertiary",
        info.status === "blocked" &&
          "cursor-pointer bg-secondary text-secondary-foreground hover:opacity-90",
        info.status === "available" &&
          !isPendingInRange &&
          !isPendingEdge &&
          "cursor-pointer border border-border bg-card hover:border-primary hover:bg-primary/5",
        isPendingEdge && "bg-primary font-semibold text-primary-foreground",
        isPendingInRange && !isPendingEdge && "bg-primary/20"
      )}
    >
      <span className="font-mono text-[13px] font-medium sm:text-sm">
        {day.getDate()}
      </span>
      {info.status === "booked" ? (
        <span className="text-[9px] font-semibold tracking-wide uppercase sm:text-[10px]">
          {t("tagBooked")}
        </span>
      ) : null}
      {info.status === "blocked" ? (
        <span className="text-[9px] font-semibold tracking-wide uppercase sm:text-[10px]">
          {info.block.reason === "UnderMaintenance"
            ? t("tagMaintenance")
            : t("tagBlocked")}
        </span>
      ) : null}
    </button>
  )
}

function Legend() {
  const t = useTranslations("apartmentManage.availability")
  const items = [
    { swatch: "border border-border bg-card", label: t("legendAvailable") },
    { swatch: "bg-tertiary/20", label: t("legendBooked") },
    { swatch: "bg-secondary", label: t("legendBlocked") },
    { swatch: "bg-muted", label: t("legendPast") },
    { swatch: "bg-primary", label: t("legendSelected") },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={cn("size-3 rounded-sm", item.swatch)}
          />
          <span className="text-xs text-foreground/70">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
