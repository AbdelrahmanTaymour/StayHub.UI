"use client"

import { User } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAssignMaintenanceRequestStaff } from "@/features/maintenance/hooks/useMaintenanceRequestTransitions"
import { useApartmentStaffLazy } from "../hooks/useApartmentStaffLazy"

interface ReassignStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string
  apartmentId: string
  currentAssigneeId?: string | null
}

export function ReassignStaffDialog({
  open,
  onOpenChange,
  requestId,
  apartmentId,
  currentAssigneeId,
}: ReassignStaffDialogProps) {
  const t = useTranslations("apartmentManage.maintenanceDetail.reassignDialog")
  const { data: staff, isPending } = useApartmentStaffLazy(apartmentId, open)
  const { mutate: assign, isPending: isAssigning } =
    useAssignMaintenanceRequestStaff(requestId, apartmentId)

  function handleSelect(staffUserId: string) {
    assign(staffUserId, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : !staff || staff.length === 0 ? (
          <p className="py-4 text-center text-sm text-foreground/70">
            {t("noStaff")}
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {staff.map((member) => {
              const isCurrent = member.userId === currentAssigneeId
              return (
                <li key={member.assignmentId}>
                  <button
                    type="button"
                    disabled={isAssigning || isCurrent}
                    onClick={() => member.userId && handleSelect(member.userId)}
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-start transition-colors hover:bg-muted disabled:cursor-default disabled:opacity-60"
                  >
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage src={member.avatarUrl ?? undefined} alt="" />
                      <AvatarFallback>
                        <User aria-hidden="true" className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-foreground/70">
                        {member.role ? t(`role.${member.role}`) : null}
                      </p>
                    </div>
                    {isCurrent ? (
                      <span className="shrink-0 text-xs font-medium text-tertiary">
                        {t("current")}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
