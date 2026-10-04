"use client"

import { useQueryClient, type QueryKey } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { addFavorite, removeFavorite } from "@/features/favorites/api/favorites"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

type FavoritableItem = { id?: string; isFavorited?: boolean }
type SearchPage = { items: FavoritableItem[] | null }

type Snapshot = {
  searchPages: [QueryKey, SearchPage | undefined][]
  detail: FavoritableItem | undefined
}

/**
 * Flips isFavorited in every cached copy of the apartment (search pages and
 * the detail page) right away. On failure, the previous values are restored.
 * Only the favorites list is invalidated, and only if it's mounted.
 */
export function useToggleFavorite(apartmentId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("favorites")

  return useApiMutation<void, boolean, Snapshot>({
    mutationFn: (next) =>
      next ? addFavorite(apartmentId) : removeFavorite(apartmentId),

    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.apartments.all })

      const searchPages = queryClient.getQueriesData<SearchPage>({
        queryKey: queryKeys.apartments.search(),
      })
      const detail = queryClient.getQueryData<FavoritableItem>(
        queryKeys.apartments.detail(apartmentId)
      )

      queryClient.setQueriesData<SearchPage>(
        { queryKey: queryKeys.apartments.search() },
        (page) =>
          page && {
            ...page,
            items:
              page.items?.map((item) =>
                item.id === apartmentId ? { ...item, isFavorited: next } : item
              ) ?? null,
          }
      )

      queryClient.setQueryData<FavoritableItem>(
        queryKeys.apartments.detail(apartmentId),
        (item) => item && { ...item, isFavorited: next }
      )

      return { searchPages, detail }
    },

    onError: (_error, _next, snapshot) => {
      if (!snapshot) return
      for (const [key, page] of snapshot.searchPages) {
        queryClient.setQueryData(key, page)
      }
      queryClient.setQueryData(
        queryKeys.apartments.detail(apartmentId),
        snapshot.detail
      )
    },

    invalidate: [queryKeys.favorites.all],
    successMessage: (_data, next) => t(next ? "addedToast" : "removedToast"),
    errorMessage: t("updateErrorToast"),
  })
}
