import { Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { StatusBadge } from "@/components/common/StatusBadge"
import { bookingStatusConfig } from "@/lib/status/status-config"
import { CancelBookingDialog } from "./CancelBookingDialog"
import { MyBookingsResponse } from "@/lib/api/types/bookings"
import { formatPrice } from "@/lib/utils/formatPrice"

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
  } = booking

  const title = apartmentName ?? t("untitledApartment")
  const detailHref = id ? `/me/bookings/${id}` : undefined
  const imageAlt = `Booking - ${apartmentName} - ${apartmentCity}`

  const dateRange =
    durationStart && durationEnd
      ? `${formatDate(durationStart, locale)} – ${formatDate(durationEnd, locale)}`
      : null

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md lg:grid lg:grid-cols-12">
      <div className="relative aspect-video overflow-hidden bg-muted lg:col-span-4 lg:aspect-auto">
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={imageAlt}
            fill
            priority={isPriority}
            sizes="(min-width: 1280px) 420px, (min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : null}
        <div className="absolute inset-s-3 top-3 flex items-center gap-2 lg:hidden">
          {/* TODO: once the backend adds payment status to MyBookingsResponse, pass
      booking.paymentStatus here instead of leaving this slot empty. */}
          {status ? (
            <StatusBadge
              status={status}
              config={bookingStatusConfig}
              namespace="bookings.status"
            />
          ) : null}
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
              <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-tertiary">
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

            <div className="hidden items-center gap-2 lg:flex">
              {/* TODO: once the backend adds payment status to MyBookingsResponse, pass
      booking.paymentStatus here instead of leaving this slot empty. */}
              {status ? (
                <StatusBadge
                  status={status}
                  config={bookingStatusConfig}
                  namespace="bookings.status"
                />
              ) : null}
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

            {canCancel && id ? (
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

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
