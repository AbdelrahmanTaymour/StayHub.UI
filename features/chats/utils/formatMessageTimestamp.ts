/** "10:24 AM" / "١٠:٢٤ ص" — used inside a message bubble. */
export function formatMessageTime(
  isoString: string | undefined,
  locale: string
): string {
  if (!isoString) return ""
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoString))
}

/** Sidebar's last-message column: time if today, weekday if this week, short date otherwise. */
export function formatConversationTimestamp(
  isoString: string | null | undefined,
  locale: string
): string {
  if (!isoString) return ""

  const date = new Date(isoString)
  const now = new Date()
  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
      86_400_000
  )

  if (diffDays === 0) {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }
  if (diffDays > 0 && diffDays < 7) {
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date)
  }
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date)
}
