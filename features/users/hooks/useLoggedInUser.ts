"use client"

import { useQuery } from "@tanstack/react-query"

import { getLoggedInUser } from "@/features/users/api/users"
import { queryKeys } from "@/lib/query/query-keys"

export function useLoggedInUser() {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: getLoggedInUser,
  })
}
