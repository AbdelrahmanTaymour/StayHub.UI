import "server-only"

import createClient from "openapi-fetch"

import type { paths } from "@/lib/api/generated/api"
import { getServerAccessToken } from "@/lib/auth/server/server-access-token"

export const apiClient = createClient<paths>({
  baseUrl: process.env.INTERNAL_API_URL,
  fetch: (request) => fetch(request, { cache: "no-store" }),
})

apiClient.use({
  async onRequest({ request }) {
    const accessToken = await getServerAccessToken()
    if (accessToken) {
      request.headers.set("Authorization", `Bearer ${accessToken}`)
    }
    return request
  },
})
