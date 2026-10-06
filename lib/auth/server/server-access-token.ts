import "server-only"

import { cache } from "react"
import { cookies, headers } from "next/headers"
import { getToken } from "next-auth/jwt"

import {
  ACCESS_TOKEN_HEADER,
  TOKEN_EXPIRY_SKEW_MS,
} from "@/lib/auth/shared/access-token"
import { SECURE_COOKIES } from "@/lib/auth/shared/auth.config"

/**
 * Returns the access token for this request, or undefined when the user is anonymous
 * or the session needs refreshing. The proxy owns refresh, so this never rotates tokens.
 * `cache` dedupes calls within one render.
 */
export const getServerAccessToken = cache(
  async (): Promise<string | undefined> => {
    const forwarded = (await headers()).get(ACCESS_TOKEN_HEADER)
    if (forwarded) return forwarded

    const cookieHeader = (await cookies())
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ")

    const token = await getToken({
      req: { headers: { cookie: cookieHeader } },
      secret: process.env.AUTH_SECRET,
      secureCookie: SECURE_COOKIES,
    })

    if (!token || token.error) return undefined
    if (Date.now() >= token.accessTokenExpires - TOKEN_EXPIRY_SKEW_MS)
      return undefined

    return token.accessToken
  }
)
