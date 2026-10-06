import type { getOwnerProfileServer } from "@/features/users/api/users.server"

export type OwnerProfile = NonNullable<
  Awaited<ReturnType<typeof getOwnerProfileServer>>
>
