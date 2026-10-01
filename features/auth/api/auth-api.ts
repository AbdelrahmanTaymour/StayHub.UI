import { apiClient } from "@/lib/api/client"
import type {
  LogInUserRequest,
  RegisterUserRequest,
  ForgotPasswordRequest,
} from "@/types/api-helpers"

export async function login(body: LogInUserRequest) {
  const { data, error } = await apiClient.POST("/api/v1/users/login", { body })
  if (error) throw error
  return data
}

export async function register(body: RegisterUserRequest) {
  const { data, error } = await apiClient.POST("/api/v1/users/register", {
    body,
  })
  if (error) throw error
  return data
}

export async function forgotPassword(body: ForgotPasswordRequest) {
  const { error } = await apiClient.POST("/api/v1/users/forgot-password", {
    body,
  })
  if (error) throw error
}

export async function refreshAccessToken(refreshToken: string) {
  const { data, error } = await apiClient.POST("/api/v1/users/refresh-token", {
    body: { refreshToken },
  })
  if (error) throw error
  return data
}
