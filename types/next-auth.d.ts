import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: "Guest" | "Admin"
    avatarUrl?: string | null
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
  }

  interface Session extends DefaultSession {
    error?: "RefreshAccessTokenError"
    user: {
      id: string
      role: "Guest" | "Admin"
      avatarUrl?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "Guest" | "Admin"
    avatarUrl?: string | null
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: "RefreshAccessTokenError"
  }
}
