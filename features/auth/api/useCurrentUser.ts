import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { useAuthStore } from "@/lib/auth/auth-store"
import type { CurrentUser } from "@/lib/permissions/types"

export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken)

  return useQuery<CurrentUser>({
    queryKey: ["users", "me"],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/users/me")
      if (error) throw error
      if (!data?.id || !data.role) {
        throw new Error("Current user data is invalid")
      }

      return {
        id: data.id,
        role: data.role as CurrentUser["role"],
      }
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}
