"use client"

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
import { getApartmentStaff } from "../api/apartment-staff"
import { useRemoveStaff } from "../hooks/useRemoveStaff"
import { staffRoleLabel } from "../utils/staff-role"

type StaffMember = NonNullable<
  Awaited<ReturnType<typeof getApartmentStaff>>
>[number]

interface RevokeStaffDialogProps {
  apartmentId: string
  member: StaffMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RevokeStaffDialog({
  apartmentId,
  member,
  open,
  onOpenChange,
}: RevokeStaffDialogProps) {
  const t = useTranslations("apartmentManage.staff")
  const remove = useRemoveStaff(apartmentId)

  function handleConfirm() {
    if (!member.assignmentId) return
    remove.mutate(member.assignmentId, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("revokeDialogTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("revokeDialogDescription", {
              name: member.fullName ?? t("unknownStaffName"),
              role: staffRoleLabel(member.role, t),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {t("revokeDialogWarning")}
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>{t("keepAssignedButton")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={remove.isPending}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {t("confirmRevokeButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
