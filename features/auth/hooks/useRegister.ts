"use client"

import { useMutation } from "@tanstack/react-query"

import { register } from "@/features/auth/api/auth.server"

export function useRegister() {
  return useMutation({
    mutationFn: register,
  })
}
