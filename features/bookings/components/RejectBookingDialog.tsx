"use client"

import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { useRejectBooking } from "@/features/bookings/hooks/useRejectBooking"

interface RejectBookingDialogProps {
  apartmentId: string
  bookingId: string
  guestName: string
  trigger: ReactElement
}

export function RejectBookingDialog({
  apartmentId,
  bookingId,
  guestName,
  trigger,
}: RejectBookingDialogProps) {
  const t = useTranslations("apartmentManage.bookings")
  const { mutate, isPending } = useRejectBooking(apartmentId)

  return (
    <ConfirmDialog
      trigger={trigger}
      title={t("rejectDialogTitle")}
      description={t("rejectDialogDescription", { name: guestName })}
      confirmLabel={t("rejectAction")}
      pendingLabel={t("rejecting")}
      cancelLabel={t("keepPending")}
      isConfirming={isPending}
      isDestructive
      onConfirm={() => mutate(bookingId)}
    />
  )
}
