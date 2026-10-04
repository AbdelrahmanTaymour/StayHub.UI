import "server-only"

import { cookies } from "next/headers"
import { getToken } from "next-auth/jwt"

import { refreshTokenRotation } from "@/lib/auth/server/auth-api"
import { SECURE_COOKIES } from "@/lib/auth/shared/auth.config"

const TOKEN_EXPIRY_SKEW_MS = 10_000

/**
 * Returns a usable access token for Server Components and Server Actions.
 *
 * Server Components can't write cookies, so an expired token is refreshed in memory only.
 * The proxy writes the new cookie on the page response.
 */
export async function getServerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])
      ),
      headers: {},
    } as unknown as Parameters<typeof getToken>[0]["req"],
    secret: process.env.AUTH_SECRET,
    secureCookie: SECURE_COOKIES,
  })

  if (!token || token.error) return undefined

  if (Date.now() < token.accessTokenExpires - TOKEN_EXPIRY_SKEW_MS) {
    return token.accessToken
  }

  const refreshed = await refreshTokenRotation(token)
  return refreshed.error ? undefined : refreshed.accessToken
}
