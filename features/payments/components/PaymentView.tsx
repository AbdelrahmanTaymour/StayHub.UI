"use client"

import { Elements } from "@stripe/react-stripe-js"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/feedback/ErrorState"
import { getStripe } from "@/lib/stripe/get-stripe"
import { useInitiatePayment } from "@/features/payments/hooks/useInitiatePayment"
import { usePaymentStatus } from "@/features/payments/hooks/usePaymentStatus"
import { PaymentCardForm } from "./PaymentCardForm"
import { PaymentFailedView } from "./PaymentFailedView"
import { PaymentProcessingView } from "./PaymentProcessingView"
import { PaymentSuccessView } from "./PaymentSuccessView"
import { formatPrice } from "@/lib/utils/formatPrice"

interface PaymentViewProps {
  bookingId: string
  amount: number
  currency: string
}

export function PaymentView({ bookingId, amount, currency }: PaymentViewProps) {
  const t = useTranslations("payment")
  const locale = useLocale()
  const {
    mutate: initiate,
    data: initiated,
    isPending: isInitiating,
    isError: initiateFailed,
  } = useInitiatePayment()
  const [hasConfirmed, setHasConfirmed] = useState(false)

  // Initiate once on mount. If a Succeeded/Pending payment already exists,
  // the backend rejects a second Initiate
  useEffect(() => {
    initiate({ bookingId })
  }, [bookingId, initiate])

  // Poll real status once the user has submitted the card. Also poll if we land
  // here after a 3DS redirect (clientSecret present in the URL, no local submit flag) —
  // Stripe appends redirect_status to return_url, which Elements reads internally.
  const isReturningFromRedirect =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("payment_intent")
  const { data: payment } = usePaymentStatus(
    bookingId,
    hasConfirmed || isReturningFromRedirect
  )

  if (payment?.status === "Succeeded") {
    return (
      <PaymentSuccessView
        bookingId={bookingId}
        amount={amount}
        currency={currency}
      />
    )
  }

  if (payment?.status === "Failed") {
    return (
      <PaymentFailedView
        onRetry={() => {
          setHasConfirmed(false)
          initiate({ bookingId })
        }}
      />
    )
  }

  if (hasConfirmed || isReturningFromRedirect) {
    return <PaymentProcessingView />
  }

  if (isInitiating || !initiated?.clientSecret) {
    if (initiateFailed) {
      return (
        <ErrorState
          title={t("initiateErrorTitle")}
          description={t("initiateErrorDescription")}
        />
      )
    }
    return <Skeleton className="h-96 w-full rounded-2xl" />
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{ clientSecret: initiated.clientSecret }}
    >
      <PaymentCardForm
        amountLabel={formatPrice(amount, currency, locale)}
        onSubmitted={() => setHasConfirmed(true)}
      />
    </Elements>
  )
}
