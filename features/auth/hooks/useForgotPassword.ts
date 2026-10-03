"use client"

import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "../api/auth"

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  })
}
