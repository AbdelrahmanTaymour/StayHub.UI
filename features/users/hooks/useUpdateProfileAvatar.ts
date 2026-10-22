"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { updateProfileAvatar } from "@/features/users/api/users"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"
import { LoggedInUserResponse } from "@/lib/api/types/users"

export function useUpdateProfileAvatar() {
  const queryClient = useQueryClient()
  const t = useTranslations("profile")
  const key = queryKeys.users.me()

  return useApiMutation<string, File, LoggedInUserResponse | undefined>({
    mutationFn: updateProfileAvatar,
    successMessage: t("avatarUpdatedToast"),

    onMutate: async (file) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<LoggedInUserResponse>(key)

      const previewUrl = URL.createObjectURL(file)
      queryClient.setQueryData<LoggedInUserResponse>(key, (data) =>
        data ? { ...data, avatarUrl: previewUrl } : data
      )

      return previous
    },

    onError: (_err, _file, previous) => {
      if (previous) queryClient.setQueryData(key, previous)
    },

    invalidate: [queryKeys.users.me()],
    errorMessage: t("avatarErrorToast"),
  })
}
