import type { NextAuthConfig } from "next-auth"

// Matches NextAuth's own cookie-prefix decision. Used by the proxy route.
export const SECURE_COOKIES =
  process.env.AUTH_URL?.startsWith("https://") ?? false

export const authConfig = {
  // Used only for NextAuth's own error redirects. Route protection lives in proxy.ts.
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig

// export const authConfig = {
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   providers: [],
//   callbacks: {
//     authorized({ auth, request }) {
//       const isLoggedIn = !!auth?.user
//       const isProtectedRoute =
//         request.nextUrl.pathname.includes("/account") ||
//         request.nextUrl.pathname.includes("/owner") ||
//         request.nextUrl.pathname.includes("/staff") ||
//         request.nextUrl.pathname.includes("/admin")

//       if (isProtectedRoute && !isLoggedIn) return false
//       return true
//     },
//   },
// } satisfies NextAuthConfig
