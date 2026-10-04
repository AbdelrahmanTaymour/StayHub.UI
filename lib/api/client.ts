import "server-only"

import createClient from "openapi-fetch"
import type { paths } from "@/lib/api/generated/api"
import { auth } from "@/lib/auth/auth-api"

export const apiClient = createClient<paths>({
  baseUrl: process.env.INTERNAL_API_URL,
})

apiClient.use({
  async onRequest({ request }) {
    const session = await auth()
    if (session?.accessToken) {
      request.headers.set("Authorization", `Bearer ${session.accessToken}`)
    }
    return request
  },
})
