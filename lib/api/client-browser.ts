"use client"

import createClient from "openapi-fetch"
import type { paths } from "@/lib/api/generated/api"
import { getSession } from "next-auth/react"

export const apiClientBrowser = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
})

apiClientBrowser.use({
  async onRequest({ request }) {
    const session = await getSession()
    if (session?.accessToken) {
      request.headers.set("Authorization", `Bearer ${session.accessToken}`)
    }
    return request
  },
})
