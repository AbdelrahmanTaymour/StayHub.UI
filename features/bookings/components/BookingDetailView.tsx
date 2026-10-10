import { ArrowRight, Navigation, ShieldCheck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button, buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import { StaySummaryCard } from "@/components/common/StaySummaryCard"
import { SummaryActionCard } from "@/components/common/SummaryActionCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { CancelBookingDialog } from "./CancelBookingDialog"
import {
  bookingStatusConfig,
  paymentDisplayStatusConfig,
} from "@/lib/status/status-config"
import { getBookingActions } from "@/features/bookings/utils/booking-actions"

import { Link } from "@/i18n/navigation"
import { BookingResponse } from "@/lib/api/types/bookings"
import { formatAddress, formatCityCountry } from "@/lib/utils/formatAddress"
import { CopyAddressButton } from "./CopyAddressButton"
import { formatPrice } from "@/lib/utils/formatPrice"
import { formatDate } from "@/features/apartments/utils/format-date"
import { getPaymentDisplayStatus } from "../utils/payment-display-status"
import { WriteReviewDialog } from "@/features/reviews/components/WriteReviewDialog"

interface BookingDetailViewProps {
  booking: BookingResponse
}

export function BookingDetailView({ booking }: BookingDetailViewProps) {
  const t = useTranslations("bookings.detail")
  const locale = useLocale()

  const title = booking.apartmentName ?? t("fallbackTitle")
  const location = formatCityCountry(booking.address)
  const fullAddress = formatAddress(booking.address)

  const paymentDisplay = getPaymentDisplayStatus(booking.paymentStatus)
  const { canPay, canCancelBooking, canReview } = getBookingActions({
    status: booking.status,
    canCancel: booking.canCancel,
    paymentStatus: booking.paymentStatus,
    hasReview: booking.hasReview,
  })

  const dateRange =
    booking.durationStart && booking.durationEnd
      ? `${formatDate(booking.durationStart, locale)} – ${formatDate(booking.durationEnd, locale)}`
      : null

  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : undefined

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
      {/* Breadcrumb lives in the page.tsx server component since it needs no client state */}

      <PageHeader
        title={t("pageTitle")}
        meta={t("meta", {
          date: formatDate(booking.createdOnUtc ?? "", locale),
        })}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {booking.status ? (
              <StatusBadge
                status={booking.status}
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
        }
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <StaySummaryCard
            imageUrl={booking.apartmentImageUrl}
            imageAlt={title}
            overlay={
              <>
                {location ? (
                  <p className="text-xs tracking-wide text-background/80 uppercase">
                    {location}
                  </p>
                ) : null}
                <h2 className="text-xl font-semibold">{title}</h2>
              </>
            }
            host={booking.host}
          />

          <SummaryActionCard
            header={
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                {t("yourStay")}
              </h3>
            }
            ledger={
              dateRange
                ? [
                    {
                      label: t("checkIn"),
                      value: formatDate(booking.durationStart!, locale),
                    },
                    {
                      label: t("checkOut"),
                      value: formatDate(booking.durationEnd!, locale),
                    },
                  ]
                : []
            }
          />

          {fullAddress ? (
            <SummaryActionCard
              header={
                <h3 className="text-lg font-semibold text-foreground">
                  {t("propertyAddress")}
                </h3>
              }
              actions={
                <div className="flex flex-col gap-3 rounded-lg bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-foreground">{fullAddress}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    <CopyAddressButton address={fullAddress} />
                    {mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "icon-sm",
                        })}
                        aria-label={t("openDirections")}
                      >
                        <Navigation aria-hidden="true" className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              }
            />
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <SummaryActionCard
              header={
                booking.totalPriceAmount != null && booking.currency ? (
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs tracking-wide text-foreground uppercase">
                      {t("totalAmountDue")}
                    </span>
                    <span className="text-xl font-semibold text-tertiary">
                      {formatPrice(
                        booking.totalPriceAmount,
                        booking.currency,
                        locale
                      )}
                    </span>
                  </div>
                ) : null
              }
              ledger={buildLedger(booking, t, locale)}
              actions={
                <>
                  {canPay && booking.id ? (
                    <Link
                      href={`/me/bookings/${booking.id}/payment`}
                      className={buttonVariants({
                        size: "lg",
                        className: "w-full gap-2",
                      })}
                    >
                      {t("payNow", {
                        amount: formatPrice(
                          booking.totalPriceAmount ?? 0,
                          booking.currency ?? "USD",
                          locale
                        ),
                      })}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 rtl:rotate-180"
                      />
                    </Link>
                  ) : null}

                  {canCancelBooking && booking.id ? (
                    <CancelBookingDialog
                      bookingId={booking.id}
                      apartmentName={title}
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full text-destructive hover:text-destructive"
                        >
                          {t("cancelBooking")}
                        </Button>
                      }
                    />
                  ) : null}

                  {canReview && booking.id ? (
                    <WriteReviewDialog
                      bookingId={booking.id}
                      apartmentName={title}
                      trigger={
                        <Button type="button" size="lg" className="w-full">
                          {t("writeReview")}
                        </Button>
                      }
                    />
                  ) : null}
                </>
              }
              footnote={
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    aria-hidden="true"
                    className="size-4 shrink-0 text-tertiary"
                  />
                  {t("guarantee")}
                </div>
              }
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

function buildLedger(
  booking: BookingResponse,
  t: ReturnType<typeof useTranslations<"bookings.detail">>,
  locale: string
) {
  if (!booking.currency) return []
  const money = (amount: number) =>
    formatPrice(amount, booking.currency!, locale)
  const rows = []

  if (
    booking.pricePerNight != null &&
    booking.nights != null &&
    booking.priceForPeriodAmount != null
  ) {
    rows.push({
      label: t("nightsRow", {
        price: money(booking.pricePerNight),
        count: booking.nights,
      }),
      value: money(booking.priceForPeriodAmount),
    })
  }
  if (booking.cleaningFeeAmount != null) {
    rows.push({
      label: t("cleaningFee"),
      value: money(booking.cleaningFeeAmount),
    })
  }
  if (
    booking.amenitiesUpChargeAmount != null &&
    booking.amenitiesUpChargeAmount > 0
  ) {
    rows.push({
      label: t("amenitiesFee"),
      value: money(booking.amenitiesUpChargeAmount),
    })
  }
  if (booking.totalPriceAmount != null) {
    rows.push({
      label: t("totalBalance"),
      value: money(booking.totalPriceAmount),
      emphasized: true,
    })
  }

  return rows
}
