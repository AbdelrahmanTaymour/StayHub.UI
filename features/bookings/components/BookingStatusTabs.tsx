"use client"

import { useTranslations } from "next-intl"

import { FilterTabs } from "@/components/common/FilterTabs"
import {
  BOOKING_TABS,
  DEFAULT_BOOKING_TAB,
} from "@/features/bookings/utils/booking-filters"

export function BookingStatusTabs() {
  const t = useTranslations("bookings.tabs")
  return (
    <FilterTabs
      ariaLabel={t("label")}
      defaultValue={DEFAULT_BOOKING_TAB}
      options={BOOKING_TABS.map((value) => ({ value, label: t(value) }))}
    />
  )
}
