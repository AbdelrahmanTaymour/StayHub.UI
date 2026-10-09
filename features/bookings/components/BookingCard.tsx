import { Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { StatusBadge } from "@/components/common/StatusBadge"
import {
  bookingStatusConfig,
  paymentDisplayStatusConfig,
} from "@/lib/status/status-config"
import { getBookingActions } from "@/features/bookings/utils/booking-actions"
import { getPaymentDisplayStatus } from "@/features/bookings/utils/payment-display-status"
import { CancelBookingDialog } from "./CancelBookingDialog"
import { MyBookingsResponse } from "@/lib/api/types/bookings"
import { formatDate } from "@/features/apartments/utils/format-date"
import { formatPrice } from "@/lib/utils/formatPrice"
import { WriteReviewDialog } from "@/features/reviews/components/WriteReviewDialog"

interface BookingCardProps {
  booking: MyBookingsResponse
  isPriority?: boolean
}

export function BookingCard({ booking, isPriority = false }: BookingCardProps) {
  const t = useTranslations("bookings")
  const locale = useLocale()

  const {
    id,
    apartmentId,
    apartmentName,
    apartmentCity,
    primaryImageUrl,
    status,
    pricePerNight,
    totalPriceAmount,
    totalPriceCurrency,
    durationStart,
    durationEnd,
    nights,
    canCancel,
    paymentStatus,
    hasReview,
  } = booking

  const title = apartmentName ?? t("untitledApartment")
  const detailHref = id ? `/me/bookings/${id}` : undefined
  const paymentDisplay = getPaymentDisplayStatus(paymentStatus)
  const { canPay, canCancelBooking, canReview } = getBookingActions({
    status,
    canCancel,
    paymentStatus,
    hasReview,
  })

  const dateRange =
    durationStart && durationEnd
      ? `${formatDate(durationStart, locale)} – ${formatDate(durationEnd, locale)}`
      : null

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md lg:grid lg:grid-cols-12">
      <div className="relative aspect-video overflow-hidden bg-muted lg:col-span-4 lg:aspect-auto">
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={t("imageAlt", { title, city: apartmentCity ?? "" })}
            fill
            priority={isPriority}
            sizes="(min-width: 1280px) 420px, (min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-s-3 top-3 flex flex-wrap items-center gap-2 lg:hidden">
          {status ? (
            <StatusBadge
              status={status}
              config={bookingStatusConfig}
              namespace="bookings.status"
            />
          ) : null}
          <StatusBadge
            status={paymentDisplay}
            config={paymentDisplayStatusConfig}
            namespace="paymentDisplayStatus"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 p-6 lg:col-span-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              {apartmentCity ? (
                <p className="flex items-center gap-1.5 text-sm text-foreground">
                  <MapPin aria-hidden="true" className="size-4" />
                  {apartmentCity}
                </p>
              ) : null}
              <h2 className="text-lg font-semibold text-foreground">
                {apartmentId ? (
                  <Link
                    href={`/apartments/${apartmentId}`}
                    className="hover:text-tertiary"
                  >
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h2>
            </div>

            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              {status ? (
                <StatusBadge
                  status={status}
                  config={bookingStatusConfig}
                  namespace="bookings.status"
                />
              ) : null}
              <StatusBadge
                status={paymentDisplay}
                config={paymentDisplayStatusConfig}
                namespace="paymentDisplayStatus"
              />
            </div>
          </div>

          {dateRange ? (
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
              <Calendar aria-hidden="true" className="size-4 text-tertiary" />
              <span>{dateRange}</span>
              {nights != null ? (
                <span className="text-xs text-foreground">
                  {t("nights", { count: nights })}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            {pricePerNight != null && totalPriceCurrency ? (
              <span className="text-xs text-foreground">
                {t("perNight", {
                  amount: formatPrice(
                    pricePerNight,
                    totalPriceCurrency,
                    locale
                  ),
                })}
              </span>
            ) : null}
            {totalPriceAmount != null && totalPriceCurrency ? (
              <span className="text-base font-semibold text-foreground tabular-nums">
                {t("total", {
                  amount: formatPrice(
                    totalPriceAmount,
                    totalPriceCurrency,
                    locale
                  ),
                })}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {detailHref ? (
              <Link
                href={detailHref}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {t("viewDetails")}
              </Link>
            ) : null}

            {canPay && id ? (
              <Link
                href={`/me/bookings/${id}/payment`}
                className={buttonVariants({ size: "sm" })}
              >
                {t("payNow")}
              </Link>
            ) : null}

            {canReview && id ? (
              <WriteReviewDialog
                bookingId={id}
                apartmentName={title}
                trigger={
                  <Button type="button" size="sm">
                    {t("writeReview")}
                  </Button>
                }
              />
            ) : null}

            {canCancelBooking && id ? (
              <CancelBookingDialog
                bookingId={id}
                apartmentName={title}
                trigger={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    {t("cancelBooking")}
                  </Button>
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
