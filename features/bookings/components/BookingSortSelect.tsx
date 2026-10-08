"use client"

import { useTranslations } from "next-intl"

import { SortSelect } from "@/components/common/SortSelect"
import { BOOKING_SORT_OPTIONS } from "@/features/bookings/utils/booking-filters"

const DEFAULT_SORT = BOOKING_SORT_OPTIONS[0]

export function BookingSortSelect() {
  const t = useTranslations("bookings.sort")

  return (
    <SortSelect
      label={t("label")}
      defaultValue={DEFAULT_SORT}
      options={BOOKING_SORT_OPTIONS.map((value) => ({
        value,
        label: t(value),
      }))}
    />
  )
}
