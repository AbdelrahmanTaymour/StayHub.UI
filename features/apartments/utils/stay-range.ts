export interface StayRange {
  startDate: string
  endDate: string
}

export type StayRangeError = "required" | "pastDate" | "invalidRange"

/** Local calendar date as YYYY-MM-DD. Avoids the UTC shift from toISOString. */
export function toDateOnly(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function getTodayDateOnly(): string {
  return toDateOnly(new Date())
}

export function fromDateOnly(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined

  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day))
}

/**
 * Validates an API-shaped stay. Empty strings mean "not chosen yet" and return no error.
 * Dates compare as strings, which is correct for YYYY-MM-DD.
 */
export function getStayRangeError(
  range: Partial<StayRange>,
  today: string
): StayRangeError | null {
  const { startDate, endDate } = range

  if (!startDate && !endDate) return null
  if (!startDate || !endDate) return "required"
  if (startDate < today) return "pastDate"
  if (endDate <= startDate) return "invalidRange"

  return null
}
