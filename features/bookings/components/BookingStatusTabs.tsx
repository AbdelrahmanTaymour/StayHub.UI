"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { usePathname, useRouter } from "@/i18n/navigation"
import {
  BOOKING_TABS,
  DEFAULT_BOOKING_TAB,
} from "@/features/bookings/utils/booking-filters"
import { cn } from "cn"

export function BookingStatusTabs() {
  const t = useTranslations("bookings.tabs")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = searchParams.get("filter") ?? DEFAULT_BOOKING_TAB

  function handleSelect(tab: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (tab === DEFAULT_BOOKING_TAB) params.delete("filter")
    else params.set("filter", tab)
    params.delete("page")

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div
      role="tablist"
      aria-label={t("label")}
      className="inline-flex w-max min-w-full gap-1 overflow-x-auto rounded-xl bg-muted p-1 lg:min-w-0"
    >
      {BOOKING_TABS.map((tab) => {
        const isActive = tab === current

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(tab)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-card text-tertiary shadow-sm"
                : "text-foreground hover:text-tertiary"
            )}
          >
            {t(tab)}
          </button>
        )
      })}
    </div>
  )
}
