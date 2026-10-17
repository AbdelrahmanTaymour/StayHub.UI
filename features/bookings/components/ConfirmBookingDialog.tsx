"use client"

import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { useConfirmBooking } from "@/features/bookings/hooks/useConfirmBooking"

interface ConfirmBookingDialogProps {
  apartmentId: string
  bookingId: string
  guestName: string
  overlapCount: number
  trigger: ReactElement
}

export function ConfirmBookingDialog({
  apartmentId,
  bookingId,
  guestName,
  overlapCount,
  trigger,
}: ConfirmBookingDialogProps) {
  const t = useTranslations("apartmentManage.bookings")
  const { mutate, isPending } = useConfirmBooking(apartmentId)

  return (
    <ConfirmDialog
      trigger={trigger}
      title={t("confirmDialogTitle")}
      description={t("confirmDialogDescription", { name: guestName })}
      notice={
        overlapCount > 0 ? (
          <p
            role="alert"
            className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300"
          >
            {t("confirmOverlapNotice", { count: overlapCount })}
          </p>
        ) : null
      }
      confirmLabel={t("confirmAction")}
      pendingLabel={t("confirming")}
      cancelLabel={t("cancel")}
      isConfirming={isPending}
      onConfirm={() => mutate(bookingId)}
    />
  )
}
