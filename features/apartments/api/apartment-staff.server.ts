import { apiClient } from "@/lib/api/client"
import { unwrap } from "@/lib/errors/api-error"

export async function getApartmentStaffServer(apartmentId: string) {
  return unwrap(
    await apiClient.GET("/api/v1/apartments/{apartmentId}/staff", {
      params: { path: { apartmentId } },
    })
  )
}
