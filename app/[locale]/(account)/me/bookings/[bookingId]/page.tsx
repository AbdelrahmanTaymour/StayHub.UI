import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { PageHeader } from "@/components/common/PageHeader"
import { getBookingServer } from "@/features/bookings/api/bookings.server"
import { StatusBadge } from "@/components/common/StatusBadge"
import { bookingStatusConfig } from "@/lib/status/status-config"

interface BookingDetailPageProps {
  params: Promise<{ locale: string; bookingId: string }>
}

export async function generateMetadata({
  params,
}: BookingDetailPageProps): Promise<Metadata> {
  const { bookingId } = await params
  const booking = await getBookingServer(bookingId)
  const t = await getTranslations("bookings.detail")

  return {
    title: booking?.apartmentName ?? t("fallbackTitle"),
    description: t("metaDescription"),
  }
}

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { bookingId } = await params

  const booking = await getBookingServer(bookingId)

  if (!booking) notFound()

  const t = await getTranslations("bookings.detail")

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <PageHeader
        title={booking.apartmentName ?? t("fallbackTitle")}
        actions={
          booking.status ? (
            <StatusBadge
              status={booking.status}
              config={bookingStatusConfig}
              namespace="bookings.status"
            />
          ) : null
        }
      />
      {/* TODO: dates, price breakdown, payment status/Pay action, cancel, review CTA — next pass */}
    </div>
  )
}
