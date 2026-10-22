"use client"

import { useQuery } from "@tanstack/react-query"

import { getUnreadNotificationsCount } from "@/features/notifications/api/notifications"
import { queryKeys } from "@/lib/query/query-keys"

const POLL_INTERVAL_MS = 30_000

export function useUnreadNotificationsCount(enabled = true) {
  const query = useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: getUnreadNotificationsCount,
    refetchInterval: POLL_INTERVAL_MS,
    enabled,
  })

  return query.data ?? 0
}
