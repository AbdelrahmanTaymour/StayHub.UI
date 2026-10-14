export const MAX_APARTMENT_IMAGES = 6
export const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024 // 1 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

export type ImageValidationError = "tooLarge" | "wrongType" | "limitReached"

export function validateImageFile(
  file: File,
  currentCount: number
): ImageValidationError | null {
  if (currentCount >= MAX_APARTMENT_IMAGES) return "limitReached"
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  )
    return "wrongType"
  if (file.size > MAX_IMAGE_SIZE_BYTES) return "tooLarge"
  return null
}
