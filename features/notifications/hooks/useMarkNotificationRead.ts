"use client"

import { useQueryClient } from "@tanstack/react-query"

import { markNotificationRead } from "@/features/notifications/api/notifications"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useApiMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}
