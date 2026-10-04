import NextAuth from "next-auth"
import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"

import { routing } from "@/i18n/routing"
import { authConfig } from "@/lib/auth/shared/auth.config"
import {
  getLocale,
  isProtectedPath,
  stripLocale,
} from "@/lib/auth/shared/protected-routes"

const { auth } = NextAuth(authConfig)
const intlMiddleware = createMiddleware(routing)

export default auth((req) => {
  const { pathname, search, origin } = req.nextUrl

  if (isProtectedPath(pathname) && (!req.auth || req.auth.error)) {
    const loginUrl = new URL(`/${getLocale(pathname)}/login`, origin)
    // LoginForm reads `from`. Store the path without the locale, because
    // next-intl's router adds the locale back.
    loginUrl.searchParams.set("from", `${stripLocale(pathname)}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
}
