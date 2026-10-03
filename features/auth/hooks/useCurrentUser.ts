"use client"

import { useSession } from "next-auth/react"
import type { CurrentUser } from "@/lib/permissions/types"

export function useCurrentUser(): CurrentUser | null {
  const { data: session } = useSession()
  if (!session?.user) return null

  return {
    id: session.user.id,
    role: session.user.role,
  }
}
