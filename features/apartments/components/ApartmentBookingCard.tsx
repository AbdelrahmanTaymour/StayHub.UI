"use client"

import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useMemo, useState } from "react"

import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import {
  DateRangePicker,
  DateRangeValue,
} from "@/components/common/DateRangePicker"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useApartmentPricing } from "@/features/apartments/hooks/useApartmentPricing"
import { formatPrice } from "@/features/apartments/utils/formatPrice"
import {
  getStayRangeError,
  toDateOnly,
  type StayRange,
} from "@/features/apartments/utils/stay-range"
import { useReserveBooking } from "@/features/bookings/hooks/useReserveBooking"
import { useAuth } from "@/providers/AuthContext"
import { ApartmentPriceBreakdown } from "./ApartmentPriceBreakdown"

interface ApartmentBookingCardProps {
  apartmentId: string
  pricePerNight?: number | null
  currency?: string | null
}

export function ApartmentBookingCard({
  apartmentId,
  pricePerNight,
  currency,
}: ApartmentBookingCardProps) {
  const t = useTranslations("apartmentDetails.booking")
  const locale = useLocale()
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  const [dates, setDates] = useState<DateRangeValue | undefined>(undefined)

  // Derived once from the picker value. The API and the validator both use YYYY-MM-DD.
  const stay = useMemo<StayRange | null>(() => {
    if (!dates?.from || !dates?.to) return null
    return {
      startDate: toDateOnly(dates.from),
      endDate: toDateOnly(dates.to),
    }
  }, [dates])

  const rangeError = useMemo(() => {
    if (!stay) return dates?.from ? ("required" as const) : null
    return getStayRangeError(stay, toDateOnly(new Date()))
  }, [stay, dates])

  const quoteStay = stay && rangeError === null ? stay : null

  const pricing = useApartmentPricing(apartmentId, quoteStay)
  const quote = pricing.data
  const isAvailable = quote?.isAvailable !== false

  const { mutate: reserve, isPending } = useReserveBooking()
  const canReserve =
    isAuthenticated &&
    quoteStay !== null &&
    quote !== undefined &&
    isAvailable &&
    !isPending

  const displayPrice = quote?.pricePerNight ?? pricePerNight ?? null
  const displayCurrency = quote?.currency ?? currency ?? null

  function handleReserve() {
    if (!quoteStay || !canReserve) return
    reserve({
      apartmentId,
      startDate: quoteStay.startDate,
      endDate: quoteStay.endDate,
    })
  }

  function renderPricing() {
    if (!quoteStay) {
      return <p className="text-sm text-foreground">{t("selectDates")}</p>
    }

    if (pricing.isPending) {
      return (
        <div role="status" className="flex flex-col gap-2">
          <span className="sr-only">{t("calculating")}</span>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )
    }

    if (pricing.isError) {
      return (
        <p role="alert" className="text-sm text-destructive">
          {t("priceError")}
        </p>
      )
    }

    if (!quote) return null

    if (!isAvailable) {
      return (
        <p role="alert" className="text-sm text-destructive">
          {t("unavailable")}
        </p>
      )
    }

    return (
      <ApartmentPriceBreakdown
        quote={quote}
        currency={displayCurrency}
        locale={locale}
      />
    )
  }

  const reserveButton = (
    <Button
      type="button"
      size="lg"
      className="w-full gap-2"
      disabled={isAuthenticated && !canReserve}
      onClick={handleReserve}
    >
      {isPending ? t("reserving") : t("reserve")}
      <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
    </Button>
  )

  return (
    <Card className="gap-6">
      {displayPrice !== null && displayCurrency ? (
        <p className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {formatPrice(displayPrice, displayCurrency, locale)}
          </span>
          <span className="text-sm text-foreground">{t("perNight")}</span>
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <DateRangePicker
          id="booking-stay"
          label={t("dates.label")}
          value={dates}
          onChange={setDates}
          placeholder={t("dates.placeholder")}
          aria-invalid={Boolean(rangeError)}
          aria-describedby={rangeError ? "booking-stay-error" : undefined}
        />
        {rangeError ? (
          <p
            id="booking-stay-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {t(`errors.${rangeError}`)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {isAuthenticated ? (
          reserveButton
        ) : (
          <LoginPromptPopover message={t("loginToReserve")}>
            {reserveButton}
          </LoginPromptPopover>
        )}
        <p className="text-center text-sm text-foreground">
          {t("reserveNote")}
        </p>
      </div>

      {renderPricing()}
    </Card>
  )
}
