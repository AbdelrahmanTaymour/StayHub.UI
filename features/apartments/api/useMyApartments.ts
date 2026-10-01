import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { useAuthStore } from "@/lib/auth/auth-store"

export function useMyApartments() {
  const accessToken = useAuthStore((s) => s.accessToken)

  return useQuery({
    queryKey: ["apartments", "mine"],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/apartments/mine", {
        params: { query: { page: 1, pageSize: 10 } },
      })
      if (error) throw error
      return data
    },
    enabled: !!accessToken, // منجربش غير لو فيه token
  })
}
