import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import {
  AddApartmentImageRequest,
  ReorderApartmentImagesRequest,
} from "@/lib/api/types/apartments"

export async function getApartmentImages(apartmentId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/{apartmentId}/images",
    { params: { path: { apartmentId } } }
  )
  if (error) throw error
  return data
}

export async function addApartmentImage(
  id: string,
  body: AddApartmentImageRequest
) {
  const { data, error } = await apiClient.POST(
    "/api/v1/apartments/{id}/images",
    {
      params: { path: { id } },
      body,
      bodySerializer(body) {
        const fd = new FormData()
        Object.entries(body as Record<string, unknown>).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null)
              fd.append(key, value as never)
          }
        )
        return fd
      },
    }
  )
  if (error) throw error
  return data
}

export async function deleteApartmentImage(imageId: string) {
  const { error } = await apiClient.DELETE(
    "/api/v1/apartments/images/{imageId}",
    {
      params: { path: { imageId } },
    }
  )
  if (error) throw error
}

export async function reorderApartmentImages(
  id: string,
  body: ReorderApartmentImagesRequest
) {
  const { error } = await apiClient.PUT(
    "/api/v1/apartments/{id}/images/order",
    {
      params: { path: { id } },
      body,
    }
  )
  if (error) throw error
}

export async function setPrimaryApartmentImage(id: string, imageId: string) {
  const { error } = await apiClient.PUT(
    "/api/v1/apartments/{id}/images/{imageId}/primary",
    { params: { path: { id, imageId } } }
  )
  if (error) throw error
}

/*
type AddApartmentImageRequest = {
    file?: string | null; // binary, sent as multipart/form-data
    isPrimary?: boolean;
}

type ReorderApartmentImagesRequest = {
    orderedImageIds?: string[] | null;
}

// Responses

type GetApartmentImagesResponse = ApartmentImagesResponse
type ApartmentImagesResponse = {
    photos?: ApartmentImageResponse[] | null;
}
type ApartmentImageResponse = {
    id?: string; // uuid
    url?: string | null;
    displayOrder?: number; // int32
    isPrimary?: boolean;
}

type AddApartmentImageResponse = string // new image id (uuid)

type DeleteApartmentImageResponse = void // 204 No Content
type ReorderApartmentImagesResponse = void // 204 No Content
type SetPrimaryApartmentImageResponse = void // 204 No Content
*/
