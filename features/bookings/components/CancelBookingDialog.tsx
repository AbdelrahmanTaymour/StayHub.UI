"use client"

import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { useCancelBooking } from "@/features/bookings/hooks/useCancelBooking"

interface CancelBookingDialogProps {
  bookingId: string
  apartmentName: string
  trigger: ReactElement
}

export function CancelBookingDialog({
  bookingId,
  apartmentName,
  trigger,
}: CancelBookingDialogProps) {
  const t = useTranslations("bookings.cancelDialog")
  const { mutate, isPending } = useCancelBooking(bookingId)

  return (
    <ConfirmDialog
      trigger={trigger}
      title={t("title")}
      description={t("description", { name: apartmentName })}
      notice={
        <Alert>
          <AlertTitle>{t("refundNoticeTitle")}</AlertTitle>
          <AlertDescription>{t("refundNoticeBody")}</AlertDescription>
        </Alert>
      }
      confirmLabel={t("confirm")}
      pendingLabel={t("confirming")}
      cancelLabel={t("dismiss")}
      isConfirming={isPending}
      isDestructive
      onConfirm={() => mutate()}
    />
  )
}
