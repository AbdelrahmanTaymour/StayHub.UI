import {
  LogInUserRequest,
  AccessTokenResponse,
  RegisterUserRequest,
} from "@/lib/api/types/auth"

const baseUrl = process.env.INTERNAL_API_URL

export async function login(body: LogInUserRequest) {
  const res = await fetch(`${baseUrl}/api/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Login failed")
  return res.json() as Promise<AccessTokenResponse>
}

export async function register(body: RegisterUserRequest) {
  const req = await fetch(`${baseUrl}/api/v1/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!req.ok) throw new Error("Registration failed")
  return req.json() as Promise<AccessTokenResponse>
}

export async function getLoggedInUser(accessToken: string) {
  const res = await fetch(`${baseUrl}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error("Failed to fetch current user")
  return res.json() as Promise<{ id: string; role: "Guest" | "Admin" }>
}

export async function refreshAccessToken(body: { refreshToken: string }) {
  const res = await fetch(`${baseUrl}/api/v1/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Refresh failed")
  return res.json() as Promise<AccessTokenResponse>
}
