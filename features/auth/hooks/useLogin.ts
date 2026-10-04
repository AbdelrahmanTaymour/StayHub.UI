"use client"

import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"

import { useRouter } from "@/i18n/navigation"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (!res?.ok || res.error) {
        throw new Error("CredentialsSignin")
      }

      router.refresh()
      return res
    },
  })
}
