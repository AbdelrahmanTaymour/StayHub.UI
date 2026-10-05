"use client"

import { ArrowRight } from "lucide-react"
import { useId, useState, type ChangeEvent } from "react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { LoginPromptPopover } from "@/components/common/LoginPromptPopover"
import { useApartmentPricing } from "@/features/apartments/hooks/useApartmentPricing"
import { formatPrice } from "@/features/apartments/utils/formatPrice"
import {
  getStayRangeError,
  getTodayDateOnly,
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

const EMPTY_RANGE: StayRange = { startDate: "", endDate: "" }

export function ApartmentBookingCard({
  apartmentId,
  pricePerNight,
  currency,
}: ApartmentBookingCardProps) {
  const t = useTranslations("apartmentDetails.booking")
  const locale = useLocale()
  const id = useId()
  const { status } = useAuth()
  const isAuthenticated = status === "authenticated"

  const [range, setRange] = useState<StayRange>(EMPTY_RANGE)
  const [today] = useState(getTodayDateOnly)

  const rangeError = getStayRangeError(range, today)
  const isStaySelected = range.startDate !== "" && range.endDate !== ""
  const quoteStay = isStaySelected && rangeError === null ? range : null

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

  const checkInId = `${id}-check-in`
  const checkOutId = `${id}-check-out`
  const errorId = `${id}-date-error`

  function handleDateChange(field: keyof StayRange) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setRange((previous) => ({ ...previous, [field]: event.target.value }))
    }
  }

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
      return <p className="text-sm text-muted-foreground">{t("selectDates")}</p>
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
    <div
      aria-live="polite"
      className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      {displayPrice !== null && displayCurrency ? (
        <p className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {formatPrice(displayPrice, displayCurrency, locale)}
          </span>
          <span className="text-sm text-muted-foreground">{t("perNight")}</span>
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={checkInId}>{t("checkIn")}</Label>
            <Input
              id={checkInId}
              type="date"
              min={today}
              value={range.startDate}
              onChange={handleDateChange("startDate")}
              aria-invalid={rangeError !== null}
              aria-describedby={rangeError ? errorId : undefined}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={checkOutId}>{t("checkOut")}</Label>
            <Input
              id={checkOutId}
              type="date"
              min={range.startDate || today}
              value={range.endDate}
              onChange={handleDateChange("endDate")}
              aria-invalid={rangeError !== null}
              aria-describedby={rangeError ? errorId : undefined}
            />
          </div>
        </div>

        {rangeError ? (
          <p id={errorId} className="text-sm text-destructive">
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
        <p className="text-center text-sm text-muted-foreground">
          {t("reserveNote")}
        </p>
      </div>

      {renderPricing()}
    </div>
  )
}
