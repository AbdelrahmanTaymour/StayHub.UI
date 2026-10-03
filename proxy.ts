import NextAuth from "next-auth"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"
import { NextResponse } from "next/server"
import { authConfig } from "@/lib/auth/auth.config"

const { auth } = NextAuth(authConfig)

const intlMiddleware = createMiddleware(routing)

const protectedSegments = ["/account", "/owner", "/staff", "/admin"]

export default auth((req) => {
  const isProtected = protectedSegments.some((seg) =>
    req.nextUrl.pathname.includes(seg)
  )

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return intlMiddleware(req) ?? NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
}
