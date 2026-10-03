import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { authConfig } from "./auth.config"
import { credentialsSchema } from "./credentials-schema"
import { decodeAccessToken } from "./decode-jwt"
import {
  login,
  getLoggedInUser,
  refreshAccessToken,
} from "@/features/auth/api/auth"
import type { JWT } from "next-auth/jwt"

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { email, password } =
            await credentialsSchema.parseAsync(credentials)

          const res = await login({ email, password })

          if (
            !res?.accessToken ||
            !res?.refreshToken ||
            !res?.expiresInSeconds
          ) {
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
          if (error instanceof ZodError) {
            console.error("[authorize] validation failed:", error.issues)
            return null
          }
          // مؤقتًا: أظهر السبب الحقيقي بدل ما نخفيه
          console.error("[authorize] unexpected error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        }
      }

      if (Date.now() < (token.accessTokenExpires as number) - 10_000) {
        return token
      }

      return refreshTokenRotation(token)
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error = token.error
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
      }
      return session
    },
  },
})

async function refreshTokenRotation(token: JWT): Promise<JWT> {
  try {
    const res = await refreshAccessToken({ refreshToken: token.refreshToken })

    if (!res?.accessToken || !res?.refreshToken || !res?.expiresInSeconds) {
      throw new Error("Refresh failed")
    }

    return {
      ...token,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      accessTokenExpires: Date.now() + res.expiresInSeconds * 1000,
      error: undefined,
    }
  } catch {
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
