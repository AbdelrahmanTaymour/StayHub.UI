import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { ReorderApartmentImagesRequest } from "@/lib/api/types/apartments"

export interface AddApartmentImageInput {
  file: File
  isPrimary?: boolean
}

export async function getApartmentImages(apartmentId: string) {
  return unwrap(
    await apiClient.GET("/api/v1/apartments/{apartmentId}/images", {
      params: { path: { apartmentId } },
    })
  )
}

export async function addApartmentImage(
  id: string,
  body: AddApartmentImageInput
) {
  return unwrap(
    await apiClient.POST("/api/v1/apartments/{id}/images", {
      params: { path: { id } },
      // Cast only at this one boundary: the generated type is wrong for a
      // multipart field, but bodySerializer below sends the real File correctly.
      body: body as unknown as { file?: string | null; isPrimary?: boolean },
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
    })
  )
}

export async function deleteApartmentImage(imageId: string) {
  return unwrap(
    await apiClient.DELETE("/api/v1/apartments/images/{imageId}", {
      params: { path: { imageId } },
    })
  )
}

export async function reorderApartmentImages(
  id: string,
  body: ReorderApartmentImagesRequest
) {
  return unwrap(
    await apiClient.PUT("/api/v1/apartments/{id}/images/order", {
      params: { path: { id } },
      body,
    })
  )
}

export async function setPrimaryApartmentImage(id: string, imageId: string) {
  return unwrap(
    await apiClient.PUT("/api/v1/apartments/{id}/images/{imageId}/primary", {
      params: { path: { id, imageId } },
    })
  )
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
