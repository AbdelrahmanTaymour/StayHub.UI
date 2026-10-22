import {
  ArrowUp,
  ArrowDown,
  Home,
  TrendingUp,
  Wallet,
  Hourglass,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { formatPrice } from "@/lib/utils/formatPrice"
import { MyApartmentsDashboardResponse } from "@/lib/api/types/apartments"
import { MetricCard } from "./MetricCard"

type MyApartmentsDashboardProps = {
  dashboard: MyApartmentsDashboardResponse
}

export function MyApartmentsDashboard({
  dashboard,
}: MyApartmentsDashboardProps) {
  const t = useTranslations("myApartments.dashboard")
  const locale = useLocale()

  const occupancyDelta =
    dashboard.currentMonthOccupancyRate != null &&
    dashboard.previousMonthOccupancyRate != null
      ? dashboard.currentMonthOccupancyRate -
        dashboard.previousMonthOccupancyRate
      : null

  /** TODO: Revenue can span multiple currencies; show the first reported one and
   * note the rest can't be summed into a single figure without a conversion rate.
   */
  const primaryRevenue = dashboard.monthToDateRevenue?.[0]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={<Home aria-hidden="true" className="size-4" />}
        label={t("totalProperties")}
        value={dashboard.totalCount ?? 0}
        footnote={t("activeInactiveSplit", {
          active: dashboard.activeCount ?? 0,
          inactive: dashboard.inactiveCount ?? 0,
        })}
      />

      <MetricCard
        icon={<TrendingUp aria-hidden="true" className="size-4" />}
        label={t("occupancyRate")}
        value={
          dashboard.currentMonthOccupancyRate != null
            ? t("percent", {
                value: dashboard.currentMonthOccupancyRate.toFixed(1),
              })
            : "—"
        }
        footnote={
          occupancyDelta != null ? (
            <span
              className={
                occupancyDelta >= 0 ? "text-emerald-600" : "text-destructive"
              }
            >
              {occupancyDelta >= 0 ? (
                <ArrowUp aria-hidden="true" className="inline size-3" />
              ) : (
                <ArrowDown aria-hidden="true" className="inline size-3" />
              )}{" "}
              {t("percent", { value: Math.abs(occupancyDelta).toFixed(1) })}{" "}
              {t("vsLastMonth")}
            </span>
          ) : null
        }
      />

      <MetricCard
        icon={<Wallet aria-hidden="true" className="size-4" />}
        label={t("monthToDateRevenue")}
        value={
          primaryRevenue?.amount != null && primaryRevenue.currency
            ? formatPrice(
                primaryRevenue.amount,
                primaryRevenue.currency,
                locale
              )
            : "—"
        }
        footnote={t("netPayoutTarget")}
      />

      <MetricCard
        icon={
          <Hourglass aria-hidden="true" className="size-4 text-amber-700" />
        }
        iconClassName="bg-amber-50"
        label={t("pendingBookings")}
        value={dashboard.pendingBookingsCount ?? 0}
        footnote={t("review")}
      />
    </div>
  )
}
