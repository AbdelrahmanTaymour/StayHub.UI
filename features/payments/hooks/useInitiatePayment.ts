"use client"

import { useTranslations } from "next-intl"

import { initiatePayment } from "@/features/payments/api/payments"
import { useApiMutation } from "@/lib/query/use-api-mutation"

export function useInitiatePayment() {
  const t = useTranslations("payment")

  return useApiMutation({
    mutationFn: initiatePayment,
    errorMessage: t("initiateErrorToast"),
  })
}
