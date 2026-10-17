"use client"

import { useTranslations } from "next-intl"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ApartmentStaffRole,
  STAFF_ROLES,
  staffRoleLabel,
} from "../utils/staff-role"

interface StaffRoleSelectProps {
  value: ApartmentStaffRole
  onChange: (role: ApartmentStaffRole) => void
  disabled?: boolean
}

export function StaffRoleSelect({
  value,
  onChange,
  disabled,
}: StaffRoleSelectProps) {
  const t = useTranslations("apartmentManage.staff")

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="assign-role-select">{t("roleLabel")}</Label>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as ApartmentStaffRole)}
        disabled={disabled}
      >
        <SelectTrigger id="assign-role-select" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAFF_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {staffRoleLabel(role, t)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
