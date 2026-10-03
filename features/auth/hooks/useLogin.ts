"use client"

import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (res?.error) {
        throw new Error("CredentialsSignin")
      }

      return res
    },
  })
}
