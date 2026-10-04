"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { signOut } from "next-auth/react"

export function useLogout() {
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = React.useState(false)

  async function logout() {
    try {
      setIsPending(true)
      queryClient.clear()
      await signOut({ callbackUrl: "/" })
    } finally {
      setIsPending(false)
    }
  }

  return { logout, isPending }
}
