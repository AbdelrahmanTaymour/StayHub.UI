import "server-only"

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import { ZodError } from "zod"

import { authConfig } from "../shared/auth.config"
import { credentialsSchema } from "../shared/credentials-schema"
import { decodeAccessToken } from "../shared/decode-jwt"
import {
  AuthRequestError,
  getLoggedInUser,
  login,
  refreshAccessToken,
} from "@/features/auth/api/auth.server"

const TOKEN_EXPIRY_SKEW_MS = 10_000
const REFRESH_REUSE_WINDOW_MS = 30_000

// Keyed by the refresh token that was used. Concurrent and slightly late callers
// reuse the first result, so a rotated refresh token is never replayed.
const recentRefreshes = new Map<
  string,
  { promise: Promise<JWT>; expiresAt: number }
>()

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        try {
          const { email, password } =
            await credentialsSchema.parseAsync(credentials)

          const res = await login({ email, password })

          if (!res.accessToken || !res.refreshToken || !res.expiresInSeconds) {
            return null
          }

          const payload = decodeAccessToken(res.accessToken)
          const me = await getLoggedInUser(res.accessToken)

          return {
            id: payload.sub,
            email: payload.email,
            role: me.role,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            accessTokenExpires: Date.now() + res.expiresInSeconds * 1000,
          }
        } catch (error) {
          // Wrong credentials and validation failures are expected; only outages are logged.
          if (error instanceof AuthRequestError && error.status >= 500) {
            console.error("[auth] backend unavailable during sign-in", {
              status: error.status,
            })
          }
          if (
            !(error instanceof ZodError) &&
            !(error instanceof AuthRequestError)
          ) {
            console.error("[auth] unexpected sign-in error", error)
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          error: undefined,
        }
      }

      if (Date.now() < token.accessTokenExpires - TOKEN_EXPIRY_SKEW_MS) {
        return token
      }

      return refreshTokenRotation(token)
    },

    async session({ session, token }) {
      // accessToken is intentionally not copied. The session is serialized to the browser.
      session.error = token.error
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
      }
      return session
    },
  },
})

export function refreshTokenRotation(token: JWT): Promise<JWT> {
  const now = Date.now()

  for (const [key, entry] of recentRefreshes) {
    if (entry.expiresAt <= now) recentRefreshes.delete(key)
  }

  const cached = recentRefreshes.get(token.refreshToken)
  if (cached) return cached.promise

  const promise = performRefresh(token)
  recentRefreshes.set(token.refreshToken, {
    promise,
    expiresAt: now + REFRESH_REUSE_WINDOW_MS,
  })
  return promise
}

async function performRefresh(token: JWT): Promise<JWT> {
  try {
    const res = await refreshAccessToken({
      refreshToken: token.refreshToken,
    })

    if (!res.accessToken || !res.refreshToken || !res.expiresInSeconds) {
      throw new Error("Incomplete refresh response")
    }

    return {
      ...token,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      accessTokenExpires: Date.now() + res.expiresInSeconds * 1000,
      error: undefined,
    }
  } catch (error) {
    console.error(
      "[auth] token refresh failed",
      error instanceof AuthRequestError ? { status: error.status } : undefined
    )
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
