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

function unwrapToStringArtifact(value: string): string {
  let current = value.trim()

  for (let i = 0; i < 5; i++) {
    const match = current.match(
      /^(?:[\w ]+:\s*)?[\w.]+\s*\{\s*\w+\s*=\s*([\s\S]*)\}$/
    )
    if (!match) break
    const next = match[1].trim()
    if (next === current) break
    current = next
  }

  return current
}

function readString(
  obj: Record<string, unknown>,
  key: string
): string | undefined {
  const value = obj[key]
  return typeof value === "string" ? unwrapToStringArtifact(value) : undefined
}

function readGuid(
  obj: Record<string, unknown>,
  key: string
): string | undefined {
  const value = obj[key]
  if (typeof value === "string") return value
  // Defensive: if a GUID also arrived wrapped the same way the message did.
  if (typeof value === "object" && value !== null) {
    const nested = Object.values(value as Record<string, unknown>).find(
      (v) => typeof v === "string"
    )
    return typeof nested === "string" ? nested : undefined
  }
  return undefined
}

function readNumber(
  obj: Record<string, unknown>,
  key: string
): number | undefined {
  const value = obj[key]
  if (typeof value === "number") return value
  if (typeof value === "string" && !Number.isNaN(Number(value)))
    return Number(value)
  return undefined
}

export interface ParsedNotificationFields {
  message?: string
  bookingId?: string
  conversationId?: string
  reviewId?: string
  responseReviewId?: string
  apartmentId?: string
  apartmentOwnerId?: string
  maintenanceRequestId?: string
  assignmentId?: string
  rating?: number
}

export function parseNotificationPayload(
  payload: string | null | undefined
): ParsedNotificationFields {
  if (!payload) return {}

  let raw: Record<string, unknown>
  try {
    const parsed = toCamelCaseKeys(JSON.parse(payload))
    if (typeof parsed !== "object" || parsed === null) return {}
    raw = parsed as Record<string, unknown>
  } catch {
    return {}
  }

  return {
    message: readString(raw, "message"),
    bookingId: readGuid(raw, "bookingId"),
    conversationId: readGuid(raw, "conversationId"),
    reviewId: readGuid(raw, "reviewId"),
    responseReviewId: readGuid(raw, "responseReviewId"),
    apartmentId: readGuid(raw, "apartmentId"),
    apartmentOwnerId: readGuid(raw, "apartmentOwnerId"),
    maintenanceRequestId: readGuid(raw, "maintenanceRequestId"),
    assignmentId: readGuid(raw, "assignmentId"),
    rating: readNumber(raw, "rating"),
  }
}
