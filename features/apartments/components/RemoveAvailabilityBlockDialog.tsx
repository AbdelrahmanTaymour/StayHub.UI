"use client"

import { format } from "date-fns"
import { useTranslations } from "next-intl"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { toDateOnly } from "@/features/apartments/utils/availability"
import { AvailabilityBlockResponse } from "@/lib/api/types/apartments"

interface RemoveAvailabilityBlockDialogProps {
  block: AvailabilityBlockResponse | null
  isDeleting: boolean
  onConfirm: (blockId: string) => void
  onCancel: () => void
}

export function RemoveAvailabilityBlockDialog({
  block,
  isDeleting,
  onConfirm,
  onCancel,
}: RemoveAvailabilityBlockDialogProps) {
  const t = useTranslations("apartmentManage.availability")

  return (
    <AlertDialog
      open={block !== null}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("removeDialogTitle")}</AlertDialogTitle>
          {block?.startDate && block?.endDate ? (
            <AlertDialogDescription>
              {t("removeDialogDescription", {
                start: format(toDateOnly(block.startDate), "MMM d"),
                end: format(toDateOnly(block.endDate), "MMM d, yyyy"),
                reason:
                  block.reason === "UnderMaintenance"
                    ? t("reason.UnderMaintenance")
                    : t("reason.OwnerBlocked"),
              })}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("keepBlocked")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault()
              if (block?.id) onConfirm(block.id)
            }}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isDeleting ? t("removing") : t("confirmRemove")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
