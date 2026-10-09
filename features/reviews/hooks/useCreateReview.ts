"use client"

import { useTranslations } from "next-intl"

import { createReview } from "@/features/reviews/api/reviews"
import { queryKeys } from "@/lib/query/query-keys"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useCreateReview() {
  const t = useTranslations("reviews")

  return useApiMutation({
    mutationFn: createReview,
    successMessage: t("submittedToast"),
    invalidate: [queryKeys.bookings.all],
  })
}
