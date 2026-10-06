"use client"

import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "cn"

/** Optional on both ends, so an unfinished or empty selection is a valid value. */
export interface DateRangeValue {
  from?: Date
  to?: Date
}

interface DateRangePickerProps {
  id: string
  value: DateRangeValue | undefined
  onChange: (value: DateRangeValue | undefined) => void
  /** Earliest selectable day. Defaults to today. */
  minDate?: Date
  label?: string
  placeholder?: string
  className?: string
  triggerClassName?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

const DATE_FORMAT = "LLL dd, y"
const TABLET_QUERY = "(min-width: 768px)"

function subscribeToTablet(callback: () => void) {
  const query = window.matchMedia(TABLET_QUERY)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function getTabletSnapshot() {
  return window.matchMedia(TABLET_QUERY).matches ? 2 : 1
}

// One month on the server, so mobile never renders an overflowing two-month calendar.
function getServerSnapshot() {
  return 1
}

function useMonthCount() {
  return React.useSyncExternalStore(
    subscribeToTablet,
    getTabletSnapshot,
    getServerSnapshot
  )
}

export function DateRangePicker({
  id,
  value,
  onChange,
  minDate,
  label,
  placeholder,
  className,
  triggerClassName,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: DateRangePickerProps) {
  const t = useTranslations("common.dateRange")
  const locale = useLocale()
  const dateLocale = locale === "ar" ? ar : enUS
  const numberOfMonths = useMonthCount()

  const disabledBefore = minDate ?? startOfToday()

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}

      {/* Stays open while the user picks both dates. Closes on outside press or Escape. */}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedBy}
              className={cn(
                "w-full justify-start gap-2 px-2.5 font-normal",
                triggerClassName
              )}
            >
              <CalendarIcon
                data-icon="inline-start"
                className="size-4 shrink-0"
              />
              {value?.from ? (
                <DateRangeLabel
                  from={value.from}
                  to={value.to}
                  locale={dateLocale}
                />
              ) : (
                <span className="text-placeholder">
                  {placeholder ?? t("placeholder")}
                </span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={value?.from ?? disabledBefore}
            selected={toCalendarRange(value)}
            onSelect={(range) =>
              onChange(range ? { from: range.from, to: range.to } : undefined)
            }
            numberOfMonths={numberOfMonths}
            disabled={{ before: disabledBefore }}
            locale={dateLocale}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

/** react-day-picker requires both keys, so the optional shape is converted here. */
function toCalendarRange(
  value: DateRangeValue | undefined
): DateRange | undefined {
  if (!value) return undefined
  return { from: value.from, to: value.to }
}

function DateRangeLabel({
  from,
  to,
  locale,
}: {
  from: Date
  to?: Date
  locale: typeof enUS
}) {
  if (!to) return <>{format(from, DATE_FORMAT, { locale })}</>

  return (
    <>
      {format(from, DATE_FORMAT, { locale })}
      {" – "}
      {format(to, DATE_FORMAT, { locale })}
    </>
  )
}

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}
