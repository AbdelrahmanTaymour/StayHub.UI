"use client"

import { format } from "date-fns"
import { CalendarCheck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  nightsBetween,
  toApiDateOnly,
} from "@/features/apartments/utils/availability"

const REASONS = ["UnderMaintenance", "OwnerBlocked"] as const
type Reason = (typeof REASONS)[number]

interface CreateAvailabilityBlockDialogProps {
  range: { start: Date; end: Date } | null
  isSaving: boolean
  onConfirm: (body: { start: string; end: string; reason: Reason }) => void
  onCancel: () => void
}

export function CreateAvailabilityBlockDialog({
  range,
  isSaving,
  onConfirm,
  onCancel,
}: CreateAvailabilityBlockDialogProps) {
  const t = useTranslations("apartmentManage.availability")
  const locale = useLocale()
  const [reason, setReason] = useState<Reason>("UnderMaintenance")

  if (!range) return null

  const nights = nightsBetween(range.start, range.end)

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="flex-row items-start gap-3 space-y-0">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <CalendarCheck className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <DialogTitle>{t("createDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("createDialogDescription", {
                start: format(range.start, "MMM d", {
                  locale: locale === "ar" ? undefined : undefined,
                }),
                end: format(range.end, "MMM d, yyyy"),
                nights,
              })}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="block-reason">{t("reasonLabel")}</Label>
          <Select
            value={reason}
            onValueChange={(value) => setReason(value as Reason)}
          >
            <SelectTrigger id="block-reason" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REASONS.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`reason.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={() =>
              onConfirm({
                start: toApiDateOnly(range.start),
                end: toApiDateOnly(range.end),
                reason,
              })
            }
            disabled={isSaving}
          >
            {isSaving ? t("creating") : t("confirmCreate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
