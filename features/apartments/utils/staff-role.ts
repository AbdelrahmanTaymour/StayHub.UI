import { Sparkles, UserCog, Wrench } from "lucide-react"
import type { useTranslations } from "next-intl"

export type ApartmentStaffRole = "Manager" | "Cleaner" | "MaintenanceStaff"

export const STAFF_ROLES: ApartmentStaffRole[] = [
  "Manager",
  "Cleaner",
  "MaintenanceStaff",
]

export function staffRoleIcon(role?: ApartmentStaffRole) {
  switch (role) {
    case "Cleaner":
      return Sparkles
    case "MaintenanceStaff":
      return Wrench
    case "Manager":
    default:
      return UserCog
  }
}

export function staffRoleLabel(
  role: ApartmentStaffRole | undefined,
  t: ReturnType<typeof useTranslations<"apartmentManage.staff">>
) {
  switch (role) {
    case "Cleaner":
      return t("roleCleaner")
    case "MaintenanceStaff":
      return t("roleMaintenance")
    case "Manager":
      return t("roleManager")
    default:
      return t("roleManager")
  }
}
