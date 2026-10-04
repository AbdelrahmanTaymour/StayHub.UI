"use client"

import { useAuth } from "@/providers/AuthContext"
import type { CurrentUser } from "@/lib/permissions/types"

export function useCurrentUser(): CurrentUser | null {
  const { session } = useAuth()
  if (!session?.user) return null

  return {
    id: session.user.id,
    role: session.user.role,
  }
}
