"use client"

import {
  CalendarDays,
  MessageCircle,
  Phone,
  User,
  UserMinus,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "cn"
import { ApartmentStaffResponse } from "@/lib/api/types/apartments"
import { staffRoleIcon, staffRoleLabel } from "../utils/staff-role"
import { RevokeStaffDialog } from "./RevokeStaffDialog"

interface StaffRosterRowProps {
  apartmentId: string
  member: ApartmentStaffResponse
}

export function StaffRosterRow({ apartmentId, member }: StaffRosterRowProps) {
  const t = useTranslations("apartmentManage.staff")
  const locale = useLocale()
  const [revokeOpen, setRevokeOpen] = useState(false)

  const name = member.fullName ?? t("unknownStaffName")
  const RoleIcon = staffRoleIcon(member.role)

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.1fr)_auto] sm:items-center sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-12 shrink-0 rounded-lg">
          <AvatarImage src={member.avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="rounded-lg">
            <User aria-hidden="true" className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{name}</p>
          {member.phoneNumber ? (
            <p className="flex items-center gap-1 text-sm text-foreground/70">
              <Phone aria-hidden="true" className="size-3.5" />
              {member.phoneNumber}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 ps-16 sm:ps-0">
        <span className="text-xs tracking-wide text-foreground/60 uppercase">
          {t("roleColumnLabel")}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <RoleIcon aria-hidden="true" className="size-4 text-primary" />
          {staffRoleLabel(member.role, t)}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 ps-16 sm:ps-0">
        <span className="text-xs tracking-wide text-foreground/60 uppercase">
          {t("assignedColumnLabel")}
        </span>
        <span className="flex items-center gap-1 text-sm text-foreground tabular-nums">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          {member.assignedOnUtc
            ? new Intl.DateTimeFormat(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(member.assignedOnUtc))
            : "—"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2 ps-16 sm:justify-end sm:ps-0">
        {member.userId ? (
          <Link
            href={`/me/chats/new?recipientId=${member.userId}&apartmentId=${apartmentId}`}
            aria-label={t("messageButtonLabel", { name })}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "gap-1.5"
            )}
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">{t("messageButton")}</span>
          </Link>
        ) : null}

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => setRevokeOpen(true)}
          aria-label={t("revokeButtonLabel", { name })}
          className="gap-1.5"
        >
          <UserMinus aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">{t("revokeButton")}</span>
        </Button>
      </div>

      <RevokeStaffDialog
        apartmentId={apartmentId}
        member={member}
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
      />
    </div>
  )
}
