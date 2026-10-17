"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { respondToReview } from "@/features/reviews/api/reviews"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useRespondToReview(apartmentId: string) {
  const queryClient = useQueryClient()
  const t = useTranslations("apartmentManage.reviews")

  return useApiMutation<string, { reviewId: string; comment: string }>({
    mutationFn: ({ reviewId, comment }) =>
      respondToReview(reviewId, { comment }),
    successMessage: t("responseSubmittedToast"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byApartment(apartmentId),
      })
    },
    errorMessage: t("responseErrorToast"),
  })
}
