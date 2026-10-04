import { apiClientBrowser } from "@/lib/api/client-browser"
import { ForgotPasswordRequest } from "@/lib/api/types/auth"

export async function forgotPassword(body: ForgotPasswordRequest) {
  const { error } = await apiClientBrowser.POST(
    "/api/v1/users/forgot-password",
    {
      body,
    }
  )
  if (error) throw error
}
