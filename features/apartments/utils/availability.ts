import {
  differenceInCalendarDays,
  eachDayOfInterval,
  isBefore,
  isWithinInterval,
  startOfDay,
} from "date-fns"

import {
  AvailabilityBlockResponse,
  BookedRangeResponse,
} from "@/lib/api/types/apartments"

export type DayStatus =
  | { status: "past" }
  | { status: "booked" }
  | { status: "blocked"; block: AvailabilityBlockResponse }
  | { status: "available" }

export function toDateOnly(value: string): Date {
  // API dates are YYYY-MM-DD; parse as local calendar date, not UTC midnight.
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function getDayStatus(
  date: Date,
  blocks: AvailabilityBlockResponse[],
  bookedRanges: BookedRangeResponse[],
  today: Date
): DayStatus {
  if (isBefore(startOfDay(date), startOfDay(today))) return { status: "past" }

  const booked = bookedRanges.some(
    (range) =>
      range.startDate &&
      range.endDate &&
      isWithinInterval(date, {
        start: toDateOnly(range.startDate),
        end: toDateOnly(range.endDate),
      })
  )
  if (booked) return { status: "booked" }

  const block = blocks.find(
    (b) =>
      b.startDate &&
      b.endDate &&
      isWithinInterval(date, {
        start: toDateOnly(b.startDate),
        end: toDateOnly(b.endDate),
      })
  )
  if (block) return { status: "blocked", block }

  return { status: "available" }
}

/** True if every day in [start, end] is available (no past/booked/blocked day inside). */
export function isRangeFree(
  start: Date,
  end: Date,
  blocks: AvailabilityBlockResponse[],
  bookedRanges: BookedRangeResponse[],
  today: Date
): boolean {
  const [from, to] = isBefore(end, start) ? [end, start] : [start, end]
  return eachDayOfInterval({ start: from, end: to }).every(
    (day) =>
      getDayStatus(day, blocks, bookedRanges, today).status === "available"
  )
}

export function nightsBetween(start: Date, end: Date): number {
  return Math.abs(differenceInCalendarDays(end, start))
}

export function toApiDateOnly(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
