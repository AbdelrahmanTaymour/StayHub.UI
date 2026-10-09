import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { BookingDetailView } from "@/features/bookings/components/BookingDetailView"
import { getBookingServer } from "@/features/bookings/api/bookings.server"

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
    <>
      <div className="mx-auto w-full max-w-7xl px-6 pt-6">
        <PageBreadcrumb
          items={[
            { label: t("breadcrumbBookings"), href: "/me/bookings" },
            { label: booking.apartmentName ?? t("fallbackTitle") },
          ]}
        />
      </div>
      <BookingDetailView booking={booking} />
    </>
  )
}
