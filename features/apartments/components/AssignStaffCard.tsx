"use client"

import { Mail, Search, User, UserPlus, UserSearch, UserX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InviteStaffDialog } from "./InviteStaffDialog"
import { StaffRoleSelect } from "./StaffRoleSelect"
import {
  ApartmentStaffResponse,
  ApartmentStaffRole,
} from "@/lib/api/types/apartments"
import { useStaffCandidateSearch } from "../hooks/useStaffCandidateSearch"
import { useAssignStaff } from "../hooks/useAssignStaff"
import { useChangeStaffRole } from "../hooks/useChangeStaffRole"
import { staffRoleLabel } from "../utils/staff-role"

interface AssignStaffCardProps {
  apartmentId: string
  staff: ApartmentStaffResponse[]
}

export function AssignStaffCard({ apartmentId, staff }: AssignStaffCardProps) {
  const t = useTranslations("apartmentManage.staff")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<ApartmentStaffRole>("Manager")
  const [inviteOpen, setInviteOpen] = useState(false)

  const search = useStaffCandidateSearch(apartmentId)
  const assign = useAssignStaff(apartmentId)
  const changeRole = useChangeStaffRole(apartmentId)

  const candidate = search.data
  const hasResult = search.isSuccess
  const found = Boolean(candidate?.userId)

  const existingAssignmentId = candidate?.userId
    ? (staff ?? []).find((member) => member.userId === candidate.userId)
        ?.assignmentId
    : undefined

  const isSaving = assign.isPending || changeRole.isPending
  const canSubmit =
    found &&
    candidate != null &&
    !candidate.isApartmentOwner &&
    (!candidate.isAlreadyAssigned || Boolean(existingAssignmentId))

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    search.mutate(trimmed, {
      onSuccess: (result) => setRole(result?.currentRole ?? "Manager"),
    })
  }

  function handleAssign() {
    if (!candidate?.userId || !canSubmit) return

    if (candidate.isAlreadyAssigned && existingAssignmentId) {
      changeRole.mutate(
        { assignmentId: existingAssignmentId, body: { role } },
        { onSuccess: () => search.reset() }
      )
      return
    }

    assign.mutate(
      { staffUserId: candidate.userId, role },
      { onSuccess: () => search.reset() }
    )
  }

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex flex-col gap-1 border-b border-border p-6">
        <div className="flex items-center gap-2">
          <UserSearch aria-hidden="true" className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            {t("assignCardTitle")}
          </h2>
        </div>
        <p className="text-sm text-foreground/70">
          {t("assignCardDescription")}
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-1.5 p-6">
        <Label htmlFor="staff-email-search">{t("emailLabel")}</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-foreground/60"
            />
            <Input
              id="staff-email-search"
              type="email"
              inputMode="email"
              autoComplete="off"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("emailPlaceholder")}
              className="ps-9"
            />
          </div>
          <Button
            type="submit"
            disabled={search.isPending}
            className="shrink-0 gap-1.5"
          >
            <Search aria-hidden="true" className="size-4" />
            {t("searchButton")}
          </Button>
        </div>
      </form>

      {hasResult ? (
        <div className="mx-6 mb-6 flex flex-col gap-4 rounded-xl border border-border bg-surface-container-low p-4">
          {found && candidate ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="size-12 shrink-0">
                  <AvatarImage src={candidate.avatarUrl ?? undefined} alt="" />
                  <AvatarFallback>
                    <User aria-hidden="true" className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {candidate.fullName}
                  </p>
                  <p className="truncate text-sm text-foreground/70">
                    {candidate.email}
                  </p>
                </div>
              </div>

              {candidate.isApartmentOwner ? (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {t("isOwnerNotice")}
                </p>
              ) : candidate.isAlreadyAssigned ? (
                <p className="rounded-lg bg-muted p-3 text-sm text-foreground/70">
                  {t("alreadyAssignedNotice", {
                    role: staffRoleLabel(candidate.currentRole, t),
                  })}
                </p>
              ) : null}

              <StaffRoleSelect
                value={role}
                onChange={setRole}
                disabled={candidate.isApartmentOwner}
              />

              <Button
                type="button"
                onClick={handleAssign}
                disabled={!canSubmit || isSaving}
                className="w-full gap-1.5"
              >
                <UserPlus aria-hidden="true" className="size-4" />
                {candidate.isAlreadyAssigned
                  ? t("updateRoleButton")
                  : t("assignButton")}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <UserX aria-hidden="true" className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {t("notFoundTitle")}
                  </p>
                  <p className="truncate text-sm text-foreground/70">
                    {search.variables}
                  </p>
                </div>
              </div>
              <p className="rounded-lg bg-muted p-3 text-sm text-foreground/70">
                {t("notFoundDescription")}
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setInviteOpen(true)}
                className="w-full gap-1.5"
              >
                <Mail aria-hidden="true" className="size-4" />
                {t("inviteButton")}
              </Button>
            </>
          )}
        </div>
      ) : null}

      <InviteStaffDialog
        apartmentId={apartmentId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        defaultEmail={search.variables ?? email}
      />
    </Card>
  )
}
