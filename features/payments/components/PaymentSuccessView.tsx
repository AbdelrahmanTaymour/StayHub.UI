import { CheckCircle2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { formatPrice } from "@/lib/utils/formatPrice"

interface PaymentSuccessViewProps {
  bookingId: string
  amount: number
  currency: string
}

export function PaymentSuccessView({
  bookingId,
  amount,
  currency,
}: PaymentSuccessViewProps) {
  const t = useTranslations("payment.success")
  const locale = useLocale()

  return (
    <Card className="items-center gap-4 p-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
        <CheckCircle2 aria-hidden="true" className="size-8" />
      </span>
      <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
      <p className="max-w-md text-sm text-foreground">{t("description")}</p>

      <dl className="flex w-full max-w-sm flex-col gap-1 rounded-xl bg-muted p-4 text-start text-sm">
        <div className="flex justify-between">
          <dt className="text-foreground">{t("amountPaid")}</dt>
          <dd className="font-semibold text-foreground tabular-nums">
            {formatPrice(amount, currency, locale)}
          </dd>
        </div>
      </dl>

      <Link
        href={`/me/bookings/${bookingId}`}
        className={buttonVariants({ size: "lg" })}
      >
        {t("viewBooking")}
      </Link>
    </Card>
  )
}
