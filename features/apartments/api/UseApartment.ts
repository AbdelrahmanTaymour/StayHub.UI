import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export function useApartment(id: string) {
  return useQuery({
    queryKey: ["apartment", id],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/apartments/{id}", {
        params: { path: { id } },
      })

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
