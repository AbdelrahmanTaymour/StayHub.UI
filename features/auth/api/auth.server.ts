import { LogInUserRequest, AccessTokenResponse } from "@/lib/api/types/auth"

const baseUrl = process.env.INTERNAL_API_URL

export class AuthRequestError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
    this.name = "AuthRequestError"
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  if (!res.ok) throw new AuthRequestError(res.status, `${path} failed`)
  return res.json() as Promise<T>
}

export function login(body: LogInUserRequest) {
  return postJson<AccessTokenResponse>("/api/v1/users/login", body)
}

export function refreshAccessToken(body: { refreshToken: string }) {
  return postJson<AccessTokenResponse>("/api/v1/users/refresh-token", body)
}

export async function getLoggedInUser(accessToken: string) {
  const res = await fetch(`${baseUrl}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new AuthRequestError(res.status, "Failed to fetch current user")
  }
  return res.json() as Promise<{ id: string; role: "Guest" | "Admin" }>
}
