"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getMyNotifications } from "@/features/notifications/api/notifications"
import { queryKeys } from "@/lib/query/query-keys"
import { GetNotificationsQuery } from "@/lib/api/types/notifications"

export function useMyNotifications(query: GetNotificationsQuery) {
  return useQuery({
    queryKey: queryKeys.notifications.list(query.unreadOnly, query.page),
    queryFn: () => getMyNotifications(query),
    placeholderData: keepPreviousData,
  })
}
