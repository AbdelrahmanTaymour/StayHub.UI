// features/bookings/components/ApartmentBookingsTable.tsx
"use client"

import { AlertTriangle } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button, buttonVariants } from "@/components/ui/button"
import { StatusBadge } from "@/components/common/StatusBadge"
import {
  bookingStatusConfig,
  paymentDisplayStatusConfig,
} from "@/lib/status/status-config"
import { getPaymentDisplayStatus } from "@/features/bookings/utils/payment-display-status"
import { getApartmentBookingActions } from "@/features/bookings/utils/apartment-booking-actions"
import { formatPrice } from "@/lib/utils/formatPrice"
import { ConfirmBookingDialog } from "./ConfirmBookingDialog"
import { RejectBookingDialog } from "./RejectBookingDialog"
import { ApartmentBookingResponse } from "@/lib/api/types/bookings"

interface ApartmentBookingsTableProps {
  apartmentId: string
  bookings: ApartmentBookingResponse[]
  overlapCounts: Map<string, string[]>
}

export function ApartmentBookingsTable({
  apartmentId,
  bookings,
  overlapCounts,
}: ApartmentBookingsTableProps) {
  const t = useTranslations("apartmentManage.bookings")

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-foreground/70">
        {t("emptyTitle")}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-start">
        <thead>
          <tr className="h-11 bg-muted text-xs font-medium tracking-wider text-foreground/70 uppercase">
            <th className="px-4 text-start">{t("colGuest")}</th>
            <th className="px-4 text-start">{t("colDates")}</th>
            <th className="px-4 text-start">{t("colTotal")}</th>
            <th className="px-4 text-start">{t("colStatus")}</th>
            <th className="px-4 pe-4 text-end">{t("colActions")}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <ApartmentBookingRow
              key={booking.id}
              apartmentId={apartmentId}
              booking={booking}
              overlapGuestIds={
                booking.id ? (overlapCounts.get(booking.id) ?? []) : []
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ApartmentBookingRow({
  apartmentId,
  booking,
  overlapGuestIds,
}: {
  apartmentId: string
  booking: ApartmentBookingResponse
  overlapGuestIds: string[]
}) {
  const t = useTranslations("apartmentManage.bookings")
  const locale = useLocale()

  const { canConfirm, canReject } = getApartmentBookingActions(booking.status)
  const guestName = booking.guestFullName ?? t("unknownGuest")
  const paymentDisplay = getPaymentDisplayStatus(booking.paymentStatus)

  return (
    <tr className="border-t border-border transition-colors hover:bg-muted/40">
      <td className="px-4 py-4 align-top">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(guestName)}
          </span>
          <span className="font-medium text-foreground">{guestName}</span>
        </div>
      </td>

      <td className="px-4 py-4 align-top">
        <div className="flex flex-col gap-1">
          {booking.durationStart && booking.durationEnd ? (
            <span className="font-medium text-foreground">
              {formatDateRange(
                booking.durationStart,
                booking.durationEnd,
                locale
              )}
            </span>
          ) : null}
          {overlapGuestIds.length > 0 ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <AlertTriangle aria-hidden="true" className="size-3.5" />
              {t("overlapsCount", { count: overlapGuestIds.length })}
            </span>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4 align-top">
        <div className="flex flex-col">
          {booking.totalPriceAmount != null && booking.totalPriceCurrency ? (
            <span className="font-semibold text-foreground tabular-nums">
              {formatPrice(
                booking.totalPriceAmount,
                booking.totalPriceCurrency,
                locale
              )}
            </span>
          ) : null}
          {booking.nights != null ? (
            <span className="text-sm text-foreground/70">
              {t("nights", { count: booking.nights })}
            </span>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4 align-top">
        <div className="flex flex-wrap items-center gap-1.5">
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
      </td>

      <td className="px-4 py-4 text-end align-top">
        <div className="inline-flex flex-wrap items-center justify-end gap-2">
          {booking.id ? (
            <a
              href={`/me/bookings/${booking.id}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {t("viewBooking")}
            </a>
          ) : null}

          {canConfirm && booking.id ? (
            <ConfirmBookingDialog
              apartmentId={apartmentId}
              bookingId={booking.id}
              guestName={guestName}
              overlapCount={overlapGuestIds.length}
              trigger={
                <Button type="button" size="sm">
                  {t("confirmAction")}
                </Button>
              }
            />
          ) : null}

          {canReject && booking.id ? (
            <RejectBookingDialog
              apartmentId={apartmentId}
              bookingId={booking.id}
              guestName={guestName}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  {t("rejectAction")}
                </Button>
              }
            />
          ) : null}
        </div>
      </td>
    </tr>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatDateRange(start: string, end: string, locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`
}
