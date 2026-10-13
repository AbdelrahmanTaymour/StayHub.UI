"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query/query-keys"
import { getMyConversations } from "../api/conversations"

export function useMyConversations() {
  return useQuery({
    queryKey: queryKeys.chats.conversations(),
    queryFn: getMyConversations,
    placeholderData: keepPreviousData,
  })
}
