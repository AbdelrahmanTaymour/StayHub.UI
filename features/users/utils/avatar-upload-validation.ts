export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB
export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

export type AvatarValidationError = "tooLarge" | "wrongType"

export function validateAvatarFile(file: File): AvatarValidationError | null {
  if (
    !ALLOWED_AVATAR_TYPES.includes(
      file.type as (typeof ALLOWED_AVATAR_TYPES)[number]
    )
  )
    return "wrongType"
  if (file.size > MAX_AVATAR_SIZE_BYTES) return "tooLarge"
  return null
}
