import { useTranslations } from "next-intl"

import { formatPrice } from "@/lib/utils/formatPrice"
import type { ApartmentPricing } from "@/features/apartments/types/apartment-details"
import { cn } from "cn"

interface ApartmentPriceBreakdownProps {
  quote: ApartmentPricing
  currency: string | null
  locale: string
}

export function ApartmentPriceBreakdown({
  quote,
  currency,
  locale,
}: ApartmentPriceBreakdownProps) {
  const t = useTranslations("apartmentDetails.booking.breakdown")

  if (!currency) return null

  const money = (amount: number) => formatPrice(amount, currency, locale)
  const hasNights =
    quote.pricePerNight != null &&
    quote.nights != null &&
    quote.subtotalForStay != null

  return (
    <dl className="flex flex-col gap-3 text-sm text-foreground">
      {hasNights ? (
        <Row
          label={t("nights", {
            price: money(quote.pricePerNight!),
            count: quote.nights!,
          })}
          value={money(quote.subtotalForStay!)}
        />
      ) : null}

      {quote.cleaningFee != null ? (
        <Row label={t("cleaningFee")} value={money(quote.cleaningFee)} />
      ) : null}

      {quote.amenitiesUpcharge != null && quote.amenitiesUpcharge > 0 ? (
        <Row label={t("amenitiesFee")} value={money(quote.amenitiesUpcharge)} />
      ) : null}

      {quote.totalPrice != null ? (
        <Row label={t("total")} value={money(quote.totalPrice)} emphasized />
      ) : null}
    </dl>
  )
}

function Row({
  label,
  value,
  emphasized = false,
}: {
  label: string
  value: string
  emphasized?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        emphasized && "rounded-xl bg-muted p-4 font-semibold text-foreground"
      )}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
