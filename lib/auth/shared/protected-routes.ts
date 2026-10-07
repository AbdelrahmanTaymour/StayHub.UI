import { routing } from "@/i18n/routing"

/**
 * URL prefixes, without locale, that require a signed-in user.
 *
 * Add the real URL prefixes here
 * @example "/bookings", "/owner".
 */
export const PROTECTED_PREFIXES: readonly string[] = [
  // TODO: Add the real URL prefixes here.
  "/me/bookings",
  "/me/favorites",
  "/me/messages",
  "/me/apartments",
  "/me/notifications",
]

const localePattern = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`)

export function getLocale(pathname: string): string {
  return pathname.match(localePattern)?.[1] ?? routing.defaultLocale
}

export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(localePattern, "")
  return stripped === "" ? "/" : stripped
}

export function isProtectedPath(pathname: string): boolean {
  const path = stripLocale(pathname)
  return PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
}
