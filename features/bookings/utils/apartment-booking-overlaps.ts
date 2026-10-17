import { ApartmentBookingResponse } from "@/lib/api/types/bookings"
import { areIntervalsOverlapping } from "date-fns"

/**
 * Flags each Reserved booking that overlaps another Reserved booking in the
 * same list. Purely a frontend warning — the backend has no "overlapping"
 * concept; it only auto-rejects at confirm time. This exists so an owner
 * can see, before confirming, that their choice will auto-reject others.
 */
export function getOverlappingBookingIds(
  bookings: ApartmentBookingResponse[]
): Map<string, string[]> {
  const pending = bookings.filter(
    (b) => b.status === "Reserved" && b.id && b.durationStart && b.durationEnd
  )
  const overlaps = new Map<string, string[]>()

  for (let i = 0; i < pending.length; i++) {
    for (let j = i + 1; j < pending.length; j++) {
      const a = pending[i]
      const b = pending[j]
      const aInterval = {
        start: new Date(a.durationStart!),
        end: new Date(a.durationEnd!),
      }
      const bInterval = {
        start: new Date(b.durationStart!),
        end: new Date(b.durationEnd!),
      }

      if (areIntervalsOverlapping(aInterval, bInterval, { inclusive: true })) {
        overlaps.set(a.id!, [...(overlaps.get(a.id!) ?? []), b.id!])
        overlaps.set(b.id!, [...(overlaps.get(b.id!) ?? []), a.id!])
      }
    }
  }

  return overlaps
}
