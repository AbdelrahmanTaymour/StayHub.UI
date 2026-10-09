"use client"

import { Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"

import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/feedback/ErrorState"

interface PaymentCardFormProps {
  amountLabel: string
  onSubmitted: () => void
}

export function PaymentCardForm({
  amountLabel,
  onSubmitted,
}: PaymentCardFormProps) {
  const t = useTranslations("payment.form")
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Separate from errorMessage: a load failure means there's no usable form at all.
  const [loadFailed, setLoadFailed] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(
        error.type === "card_error" || error.type === "validation_error"
          ? (error.message ?? t("genericError"))
          : t("genericError")
      )
      setIsSubmitting(false)
      return
    }

    onSubmitted()
  }

  if (loadFailed) {
    return (
      <ErrorState
        title={t("loadErrorTitle")}
        description={t("loadErrorDescription")}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement onLoadError={() => setLoadFailed(true)} />

      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          size="lg"
          disabled={!stripe || !elements || isSubmitting}
          className="w-full gap-2"
        >
          <Lock aria-hidden="true" className="size-4" />
          {isSubmitting ? t("processing") : t("pay", { amount: amountLabel })}
        </Button>
        <p className="text-center text-sm text-foreground">{t("disclosure")}</p>
      </div>
    </form>
  )
}
