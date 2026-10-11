/**
 * Case/whitespace-insensitive comparison for two user/GUID ids.
 *
 * This guards against a casing mismatch, but it can't fix two values that
 * are genuinely different ids — if messages are still misattributed after
 * this, the id your frontend treats as "me" (session.user.id) doesn't
 * match the id the backend stamped the message with (IUserContext.UserId,
 * from the JWT). Log both and compare directly to confirm.
 */
export function isSameUser(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  if (!a || !b) return false
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}
