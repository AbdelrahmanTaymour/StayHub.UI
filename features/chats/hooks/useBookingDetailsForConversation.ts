"use client"

import { useQuery } from "@tanstack/react-query"

import { getConversationBookingDetails } from "@/features/bookings/api/bookings"
import { queryKeys } from "@/lib/query/query-keys"

export function useBookingDetailsForConversation(
  conversationId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: queryKeys.chats.bookingDetails(conversationId),
    queryFn: () => getConversationBookingDetails(conversationId),
    enabled,
  })
}
