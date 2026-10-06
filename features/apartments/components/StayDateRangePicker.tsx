"use client"

import { CalendarDays } from "lucide-react"
import dynamic from "next/dynamic"
import { useLocale, useTranslations } from "next-intl"
import { ar, enUS } from "date-fns/locale"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import {
  fromDateOnly,
  toDateOnly,
  type StayRange,
} from "@/features/apartments/utils/stay-range"

const StayCalendar = dynamic(
  () => import("@/components/ui/calendar").then((mod) => mod.Calendar),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-72" />,
  }
)

interface StayDateRangePickerProps {
  value: StayRange
  today: string
  onChange: (range: StayRange) => void
}

function formatShortDate(dateOnly: string, locale: string) {
  const date = fromDateOnly(dateOnly)
  if (!date) return ""
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date)
}

export function StayDateRangePicker({
  value,
  today,
  onChange,
}: StayDateRangePickerProps) {
  const t = useTranslations("apartmentDetails.booking.dates")
  const locale = useLocale()
  const dateLocale = locale === "ar" ? ar : enUS
  const [open, setOpen] = useState(false)

  const hasStay = value.startDate !== "" && value.endDate !== ""
  const selected: DateRange = {
    from: fromDateOnly(value.startDate),
    to: fromDateOnly(value.endDate),
  }
  const minDate = fromDateOnly(today)

  function handleSelect(next: DateRange | undefined) {
    onChange({
      startDate: next?.from ? toDateOnly(next.from) : "",
      endDate: next?.to ? toDateOnly(next.to) : "",
    })

    if (next?.from && next?.to) setOpen(false)
  }

  const label = hasStay
    ? t("range", {
        start: formatShortDate(value.startDate, locale),
        end: formatShortDate(value.endDate, locale),
      })
    : t("placeholder")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-auto w-full justify-start gap-3 px-4 py-3 text-start font-normal"
          >
            <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
            <span className="flex flex-col items-start">
              <span className="text-xs text-foreground">{t("label")}</span>
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
            </span>
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <StayCalendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          disabled={minDate ? { before: minDate } : undefined}
          defaultMonth={selected.from ?? minDate}
          numberOfMonths={1}
          locale={dateLocale}
        />
      </PopoverContent>
    </Popover>
  )
}
