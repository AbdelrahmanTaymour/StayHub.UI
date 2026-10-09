import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { PageHeader } from "@/components/common/PageHeader"
import { SummaryActionCard } from "@/components/common/SummaryActionCard"
import { PaymentView } from "@/features/payments/components/PaymentView"
import { getBookingServer } from "@/features/bookings/api/bookings.server"
import { getBookingActions } from "@/features/bookings/utils/booking-actions"
import { formatPrice } from "@/lib/utils/formatPrice"
import Image from "next/image"
import { formatDate } from "@/features/apartments/utils/format-date"

interface PaymentPageProps {
  params: Promise<{ locale: string; bookingId: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("payment")
  return { title: t("pageTitle"), description: t("metaDescription") }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { locale, bookingId } = await params

  const booking = await getBookingServer(bookingId)
  if (!booking) notFound()

  // Initiate is only valid once Confirmed. Guard the route itself,
  // not just the button that links here.
  const { canPay } = getBookingActions({
    status: booking.status,
    canCancel: booking.canCancel,
  })
  if (!canPay) notFound()

  const t = await getTranslations("payment")
  const title = booking.apartmentName ?? t("fallbackTitle")
  const amount = booking.totalPriceAmount ?? 0
  const currency = booking.currency ?? "USD"

  const dateRange =
    booking.durationStart && booking.durationEnd
      ? `${formatDate(booking.durationStart, locale)} – ${formatDate(booking.durationEnd, locale)}`
      : null

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-6 pt-6">
        <PageBreadcrumb
          items={[
            { label: t("breadcrumbBookings"), href: "/me/bookings" },
            { label: title, href: `/me/bookings/${bookingId}` },
            { label: t("breadcrumbPayment") },
          ]}
        />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6">
        <PageHeader title={t("pageTitle")} meta={t("pageDescription")} />

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <PaymentView
              bookingId={bookingId}
              amount={amount}
              currency={currency}
            />
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <SummaryActionCard
                header={
                  <div className="flex flex-col gap-3">
                    <div className="relative h-32 w-full overflow-hidden rounded-xl bg-muted">
                      {booking.apartmentImageUrl ? (
                        <Image
                          src={booking.apartmentImageUrl}
                          alt={title}
                          fill
                          sizes="400px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">{title}</h2>
                      {dateRange ? (
                        <p className="text-sm text-foreground">{dateRange}</p>
                      ) : null}
                    </div>
                  </div>
                }
                ledger={[
                  {
                    label: t("totalDue"),
                    value: formatPrice(amount, currency, locale),
                    emphasized: true,
                  },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
