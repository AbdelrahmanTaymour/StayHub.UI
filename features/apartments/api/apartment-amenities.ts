import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { AddApartmentAmenityRequest, Amenity } from "@/lib/api/types/apartments"

export async function getApartmentAmenities(apartmentId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/{apartmentId}/amenities",
    { params: { path: { apartmentId } } }
  )
  if (error) throw error
  return data
}

export async function addApartmentAmenity(
  id: string,
  body: AddApartmentAmenityRequest
) {
  const { error } = await apiClient.POST("/api/v1/apartments/{id}/amenities", {
    params: { path: { id } },
    body,
  })
  if (error) throw error
}

export async function removeApartmentAmenity(id: string, amenity: Amenity) {
  const { error } = await apiClient.DELETE(
    "/api/v1/apartments/{id}/amenities",
    {
      params: { path: { id }, query: { amenity } },
    }
  )
  if (error) throw error
}

/*
type AddApartmentAmenityRequest = {
    amenity?: Amenity;
}

type Amenity =
    | "WiFi"
    | "AirConditioning"
    | "Parking"
    | "PetFriendly"
    | "SwimmingPool"
    | "Gym"
    | "Spa"
    | "Terrace"
    | "MountainView"
    | "GardenView"

// Responses

type GetApartmentAmenitiesResponse = ApartmentAmenitiesResponse
type ApartmentAmenitiesResponse = {
    amenities?: string[] | null;
}

type AddApartmentAmenityResponse = void // 204 No Content
type RemoveApartmentAmenityResponse = void // 204 No Content
*/
