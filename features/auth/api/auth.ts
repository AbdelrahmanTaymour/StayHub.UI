import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { unwrap } from "@/lib/errors/api-error"
import type {
  ForgotPasswordRequest,
  RegisterUserRequest,
} from "@/lib/api/types/auth"

export async function forgotPassword(body: ForgotPasswordRequest) {
  return unwrap(await apiClient.POST("/api/v1/users/forgot-password", { body }))
}

export async function register(body: RegisterUserRequest) {
  return unwrap(await apiClient.POST("/api/v1/users/register", { body }))
}
