import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isProtectedRoute =
        request.nextUrl.pathname.includes("/account") ||
        request.nextUrl.pathname.includes("/owner") ||
        request.nextUrl.pathname.includes("/staff") ||
        request.nextUrl.pathname.includes("/admin")

      if (isProtectedRoute && !isLoggedIn) return false
      return true
    },
  },
} satisfies NextAuthConfig
