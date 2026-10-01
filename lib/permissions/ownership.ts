import type { CurrentUser, OwnableResource } from "./types"

export function isOwner(
  user: CurrentUser | null,
  resource: OwnableResource | null | undefined
): boolean {
  if (!user || !resource) return false
  return resource.ownerId === user.id
}
