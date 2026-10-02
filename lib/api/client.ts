import type { paths } from "@/lib/api/generated/api"
import createClient from "openapi-fetch"
import { authStore } from "@/lib/auth/auth-store"
import { refreshAccessToken } from "@/features/auth/api/auth"

export const apiClient = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
})

let refreshPromise: Promise<string | null> | null = null

async function getRefreshedToken() {
  const refreshToken = authStore.getState().refreshToken
  if (!refreshToken) return null

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken(refreshToken)
      .then((res) => {
        if (!res?.accessToken || !res?.refreshToken) return null
        authStore.getState().setSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
        return res.accessToken
      })
      .catch(() => {
        authStore.getState().clearSession()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.use({
  onRequest({ request }) {
    const token = authStore.getState().accessToken
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`)
    }
    return request
  },
  async onResponse({ request, response }) {
    if (response.status === 401) {
      const newToken = await getRefreshedToken()
      if (newToken) {
        request.headers.set("Authorization", `Bearer ${newToken}`)
        return fetch(request)
      }
    }
    return response
  },
})
