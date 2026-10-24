"use client"

import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import type { ApartmentStaffResponse } from "@/lib/api/types/apartments"
import { AssignStaffCard } from "@/features/apartments/components/AssignStaffCard"

interface AssignStaffDialogProps {
  apartmentId: string
  staff: ApartmentStaffResponse[]
}

export function AssignStaffDialog({
  apartmentId,
  staff,
}: AssignStaffDialogProps) {
  const t = useTranslations("apartmentManage.staff")

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" className="gap-1.5" />}>
        <UserPlus aria-hidden="true" className="size-4" />
        {t("addStaffButton")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("assignCardTitle")}</DialogTitle>
          <DialogDescription>{t("assignCardDescription")}</DialogDescription>
        </DialogHeader>
        <AssignStaffCard apartmentId={apartmentId} staff={staff} embedded />
      </DialogContent>
    </Dialog>
  )
}
