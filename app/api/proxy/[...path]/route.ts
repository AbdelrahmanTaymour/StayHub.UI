import "server-only"

import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { SECURE_COOKIES } from "@/lib/auth/shared/auth.config"

const BACKEND_URL = process.env.INTERNAL_API_URL
const TOKEN_EXPIRY_SKEW_MS = 10_000

// The backend returns tokens in the response body. These must never reach the browser.
const BLOCKED_ROUTES = new Set([
  "api/v1/users/login",
  "api/v1/users/refresh-token",
])

const REQUEST_HEADERS_TO_DROP = [
  "host",
  "connection",
  "cookie",
  "authorization",
  "content-length",
  "accept-encoding",
]

const RESPONSE_HEADERS_TO_DROP = [
  "connection",
  "keep-alive",
  "transfer-encoding",
  "content-encoding",
  "content-length",
  "set-cookie",
]

type RouteContext = { params: Promise<{ path: string[] }> }

async function proxyRequest(req: NextRequest, { params }: RouteContext) {
  const route = (await params).path.join("/")

  if (!route.startsWith("api/v1/") || BLOCKED_ROUTES.has(route)) {
    return NextResponse.json({ title: "Not found" }, { status: 404 })
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: SECURE_COOKIES,
  })

  // expired token returns 401 and the browser client asks NextAuth to refresh.
  if (token) {
    if (token.error) return unauthorized("session_error")
    if (Date.now() >= token.accessTokenExpires - TOKEN_EXPIRY_SKEW_MS) {
      return unauthorized("token_expired")
    }
  }

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    if (!REQUEST_HEADERS_TO_DROP.includes(key)) headers.set(key, value)
  })
  if (token?.accessToken) {
    headers.set("Authorization", `Bearer ${token.accessToken}`)
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD"

  const upstream = await fetch(`${BACKEND_URL}/${route}${req.nextUrl.search}`, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: "manual",
    cache: "no-store",
  })

  const responseHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    if (!RESPONSE_HEADERS_TO_DROP.includes(key)) {
      responseHeaders.set(key, value)
    }
  })

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

function unauthorized(reason: string) {
  return NextResponse.json(
    { title: "Unauthorized", detail: reason },
    { status: 401, headers: { "x-auth-reason": reason } }
  )
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as PATCH,
  proxyRequest as DELETE,
}
