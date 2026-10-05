export interface StayRange {
  startDate: string // DateOnly, YYYY-MM-DD
  endDate: string
}

export type StayRangeError = "required" | "pastDate" | "invalidRange"

/** Local calendar date as YYYY-MM-DD. ISO date strings sort correctly as text. */
export function getTodayDateOnly(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

export function getStayRangeError(
  range: StayRange,
  today: string
): StayRangeError | null {
  const { startDate, endDate } = range

  if (!startDate && !endDate) return null
  if (!startDate || !endDate) return "required"
  if (startDate < today) return "pastDate"
  if (endDate <= startDate) return "invalidRange"

  return null
}
