import { apiClient } from "@/lib/api/client"
import { CreateApartmentAvailabilityBlockRequest } from "@/lib/api/types/apartments"

export async function getApartmentAvailabilityBlocks(apartmentId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/{apartmentId}/availability-blocks",
    { params: { path: { apartmentId } } }
  )
  if (error) throw error
  return data
}

export async function createApartmentAvailabilityBlock(
  id: string,
  body: CreateApartmentAvailabilityBlockRequest
) {
  const { data, error } = await apiClient.POST(
    "/api/v1/apartments/{id}/availability-blocks",
    { params: { path: { id } }, body }
  )
  if (error) throw error
  return data
}

export async function deleteApartmentAvailabilityBlock(blockId: string) {
  const { error } = await apiClient.DELETE(
    "/api/v1/apartments/availability-blocks/{blockId}",
    { params: { path: { blockId } } }
  )
  if (error) throw error
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
