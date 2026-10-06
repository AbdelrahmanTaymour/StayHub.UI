// import NextAuth from "next-auth"
// import createMiddleware from "next-intl/middleware"
// import { NextResponse } from "next/server"

// import { routing } from "@/i18n/routing"
// import { authConfig } from "@/lib/auth/shared/auth.config"
// import {
//   getLocale,
//   isProtectedPath,
//   stripLocale,
// } from "@/lib/auth/shared/protected-routes"

// const { auth } = NextAuth(authConfig)
// const intlMiddleware = createMiddleware(routing)

// export default auth((req) => {
//   const { pathname, search, origin } = req.nextUrl

//   if (isProtectedPath(pathname) && (!req.auth || req.auth.error)) {
//     const loginUrl = new URL(`/${getLocale(pathname)}/login`, origin)
//     // LoginForm reads `from`. Store the path without the locale, because
//     // next-intl's router adds the locale back.
//     loginUrl.searchParams.set("from", `${stripLocale(pathname)}${search}`)
//     return NextResponse.redirect(loginUrl)
//   }

//   return intlMiddleware(req)
// })

// export const config = {
//   matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
// }
import NextAuth from "next-auth"
import { getToken } from "next-auth/jwt"
import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

import { routing } from "@/i18n/routing"
import { refreshTokenRotation } from "@/lib/auth/server/auth-api"
import {
  ACCESS_TOKEN_HEADER,
  TOKEN_EXPIRY_SKEW_MS,
} from "@/lib/auth/shared/access-token"
import { authConfig, SECURE_COOKIES } from "@/lib/auth/shared/auth.config"
import {
  getLocale,
  isProtectedPath,
  stripLocale,
} from "@/lib/auth/shared/protected-routes"

const { auth } = NextAuth(authConfig)
const intlMiddleware = createMiddleware(routing)

export default auth(async (req) => {
  const { pathname, search, origin } = req.nextUrl

  if (isProtectedPath(pathname) && (!req.auth || req.auth.error)) {
    const loginUrl = new URL(`/${getLocale(pathname)}/login`, origin)
    loginUrl.searchParams.set("from", `${stripLocale(pathname)}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  // Never trust a client-sent copy of the internal header.
  const headers = new Headers(req.headers)
  headers.delete(ACCESS_TOKEN_HEADER)

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: SECURE_COOKIES,
  })

  if (token && !token.error) {
    const usable =
      Date.now() < token.accessTokenExpires - TOKEN_EXPIRY_SKEW_MS
        ? token
        : await refreshTokenRotation(token)

    if (!usable.error) headers.set(ACCESS_TOKEN_HEADER, usable.accessToken)
  }

  return intlMiddleware(new NextRequest(req, { headers }))
})

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
}
