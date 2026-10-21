"use client"

import { ShieldCheck, Users } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ApartmentStaffResponse } from "@/lib/api/types/apartments"
import { StaffRosterRow } from "./StaffRosterRow"

interface ActiveStaffRosterProps {
  apartmentId: string
  staff: ApartmentStaffResponse[]
}

export function ActiveStaffRoster({
  apartmentId,
  staff,
}: ActiveStaffRosterProps) {
  const t = useTranslations("apartmentManage.staff")
  const members = staff ?? []

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-1 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("rosterTitle")}
          </h2>
          <p className="text-sm text-foreground/70">{t("rosterDescription")}</p>
        </div>
        <span className="flex w-fit items-center gap-1.5 text-xs text-foreground/70">
          <ShieldCheck aria-hidden="true" className="size-3.5 text-primary" />
          {t("scopedBadge")}
        </span>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={<Users aria-hidden="true" className="size-8" />}
          title={t("emptyRosterTitle")}
          description={t("emptyRosterDescription")}
          className="m-6 border-none"
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border px-6 pb-6">
          {members.map((member) => (
            <li key={member.assignmentId}>
              <StaffRosterRow apartmentId={apartmentId} member={member} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
