import type { Metadata } from "next"
import { Suspense } from "react"
import { getTranslations } from "next-intl/server"

import { PageHeader } from "@/components/common/PageHeader"
import { BookingsList } from "@/features/bookings/components/BookingsList"
import { BookingsListSkeleton } from "@/features/bookings/components/BookingsListSkeleton"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("bookings")
  return { title: t("pageTitle"), description: t("pageDescription") }
}

export default async function MyBookingsPage() {
  const t = await getTranslations("bookings")

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
      <PageHeader title={t("pageTitle")} meta={t("pageDescription")} />
      <Suspense fallback={<BookingsListSkeleton />}>
        <BookingsList />
      </Suspense>
    </div>
  )
}
