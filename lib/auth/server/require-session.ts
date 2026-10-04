import "server-only"

import { redirect } from "next/navigation"

import type { routing } from "@/i18n/routing"
import { auth } from "@/lib/auth/server/auth-api"

type Locale = (typeof routing.locales)[number]

/**
 * Proxy checks are optimistic. This layout-level guard is the real security boundary, so call it from each protected route group's layout
 *
 * Requires a valid session for the current request. If the user is not logged in, redirects to the login page.
 * @param locale The locale of the current request, used for redirecting to the correct login page.
 *
 * @param role Optional. If provided, the user must have this role to access the route. If the user does not have the required role, they will be redirected to the home page.
 *
 * @returns The session object for the current request, if the user is logged in and has the required role (if specified).
 *
 * @example app/[locale]/(account)/layout.tsx
 * export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  await requireSession({ locale })
  return children
}
 */
export async function requireSession({
  locale,
  role,
}: {
  locale: Locale
  role?: "Guest" | "Admin"
}) {
  const session = await auth()

  if (!session?.user || session.error) {
    redirect(`/${locale}/login`)
  }

  if (role && session.user.role !== role) {
    redirect(`/${locale}`)
  }

  return session
}
