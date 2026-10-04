import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { CreateApartmentAvailabilityBlockRequest } from "@/lib/api/types/apartments"

export async function getApartmentAvailabilityBlocks(apartmentId: string) {
  return unwrap(
    await apiClient.GET(
      "/api/v1/apartments/{apartmentId}/availability-blocks",
      {
        params: { path: { apartmentId } },
      }
    )
  )
}

export async function createApartmentAvailabilityBlock(
  id: string,
  body: CreateApartmentAvailabilityBlockRequest
) {
  return unwrap(
    await apiClient.POST("/api/v1/apartments/{id}/availability-blocks", {
      params: { path: { id } },
      body,
    })
  )
}

export async function deleteApartmentAvailabilityBlock(blockId: string) {
  return unwrap(
    await apiClient.DELETE("/api/v1/apartments/availability-blocks/{blockId}", {
      params: { path: { blockId } },
    })
  )
}

/*
type CreateApartmentAvailabilityBlockRequest = {
    start?: string; // date
    end?: string; // date
    reason?: ApartmentUnavailabilityReason;
}

type ApartmentUnavailabilityReason = "OwnerBlocked" | "UnderMaintenance" | "Booked"
// OwnerBlocked: owner manually blocked the dates (not bookable)
// UnderMaintenance: apartment is unavailable for maintenance work
// Booked: dates are taken by an existing booking (system-managed, not usually set manually)

// Responses

type GetApartmentAvailabilityBlocksResponse = ApartmentAvailabilityResponse
type ApartmentAvailabilityResponse = {
    blocks?: AvailabilityBlockResponse[] | null;
    bookedRanges?: BookedRangeResponse[] | null;
}
type AvailabilityBlockResponse = {
    id?: string; // uuid
    startDate?: string; // date
    endDate?: string; // date
    reason?: string | null;
}
type BookedRangeResponse = {
    bookingId?: string; // uuid
    startDate?: string; // date
    endDate?: string; // date
}

type CreateApartmentAvailabilityBlockResponse = string // new block id (uuid)

type DeleteApartmentAvailabilityBlockResponse = void // 204 No Content
*/
