"use client"

import createClient from "openapi-fetch"
import { getSession } from "next-auth/react"

import type { paths } from "@/lib/api/generated/api"

const AUTH_REASON_HEADER = "x-auth-reason"

/**
 * If the proxy reports an expired token, ask NextAuth to refresh the session.
 * NextAuth's session route writes the new cookie. Then retry once.
 * This costs an extra request only when a token has actually expired.
 */
async function fetchWithSessionRefresh(request: Request): Promise<Response> {
  const retry = request.clone()
  const response = await fetch(request)

  if (
    response.status !== 401 ||
    response.headers.get(AUTH_REASON_HEADER) !== "token_expired"
  ) {
    return response
  }

  await getSession()
  return fetch(retry)
}

export const apiClientBrowser = createClient<paths>({
  baseUrl: "/api/proxy",
  fetch: fetchWithSessionRefresh,
})
