import type { CurrentUser, StaffAssignment } from "./types"

export function getStaffAssignment(
  user: CurrentUser | null,
  staffList: StaffAssignment[] | null | undefined
): StaffAssignment | null {
  if (!user || !staffList) return null
  return staffList.find((s) => s.userId === user.id) ?? null
}

export function isStaffOf(
  user: CurrentUser | null,
  staffList: StaffAssignment[] | null | undefined
): boolean {
  return getStaffAssignment(user, staffList) !== null
}

export function hasStaffRole(
  user: CurrentUser | null,
  staffList: StaffAssignment[] | null | undefined,
  role: StaffAssignment["role"]
): boolean {
  return getStaffAssignment(user, staffList)?.role === role
}
