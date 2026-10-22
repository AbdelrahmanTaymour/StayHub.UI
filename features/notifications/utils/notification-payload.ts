import { z } from "zod"

import type { NotificationType } from "@/lib/api/types/notifications"

const base = { message: z.string() }

const payloadSchemas = {
  BookingConfirmed: z.object({ bookingId: z.string(), ...base }),
  BookingRejected: z.object({ bookingId: z.string(), ...base }),
  BookingCancelled: z.object({ bookingId: z.string(), ...base }),
  NewMessage: z.object({ conversationId: z.string(), ...base }),
  ReviewReceived: z.object({
    reviewId: z.string(),
    apartmentId: z.string(),
    rating: z.number(),
    ...base,
  }),
  ReviewResponseReceived: z.object({
    reviewId: z.string(),
    apartmentId: z.string(),
    responseReviewId: z.string(),
    ...base,
  }),
  MaintenanceRequestCreated: z.object({
    maintenanceRequestId: z.string(),
    apartmentId: z.string(),
    ...base,
  }),
  MaintenanceRequestUpdate: z.object({
    maintenanceRequestId: z.string(),
    ...base,
  }),
  ApartmentStaffAssignmentCreated: z.object({
    assignmentId: z.string(),
    apartmentId: z.string(),
    apartmentOwnerId: z.string(),
    ...base,
  }),
} satisfies Record<NotificationType, z.ZodType>

export type ParsedNotificationPayload<T extends NotificationType> = z.infer<
  (typeof payloadSchemas)[T]
>

/**
- The backend serializes each payload with PascalCase .NET property names
- (e.g. "BookingId", "Message") via System.Text.Json's default behavior.
- This normalizes every key to camelCase before validating against the
- Zod schema below, so the frontend types stay camelCase throughout.
 */
function toCamelCaseKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toCamelCaseKeys)
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key.charAt(0).toLowerCase() + key.slice(1),
        toCamelCaseKeys(val),
      ])
    )
  }
  return value
}

/**
- Parses a notification's raw JSON payload string against the schema for
- its type. Returns null on any parse/shape failure — callers fall back to
- a generic, non-navigable row rather than throwing, since a malformed
- payload shouldn't break the whole notifications list.
 */
export function parseNotificationPayload<T extends NotificationType>(
  type: T,
  payload: string | null | undefined
): ParsedNotificationPayload<T> | null {
  if (!payload) return null

  try {
    const raw = toCamelCaseKeys(JSON.parse(payload))
    const schema = payloadSchemas[type]
    const result = schema.safeParse(raw)
    return result.success ? (result.data as ParsedNotificationPayload<T>) : null
  } catch {
    return null
  }
}
