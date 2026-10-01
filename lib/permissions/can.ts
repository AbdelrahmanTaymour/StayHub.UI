import { isOwner } from "./ownership"
import { isStaffOf, hasStaffRole } from "./staff"
import type { CurrentUser, OwnableResource, StaffAssignment } from "./types"

export const can = {
  // --- Apartment management (Owner) ---
  editApartment: (
    user: CurrentUser | null,
    apartment: OwnableResource | null
  ) => isOwner(user, apartment),

  deleteApartment: (
    user: CurrentUser | null,
    apartment: OwnableResource | null
  ) => isOwner(user, apartment),

  manageStaff: (user: CurrentUser | null, apartment: OwnableResource | null) =>
    isOwner(user, apartment),

  viewApartmentDashboard: (
    user: CurrentUser | null,
    apartment: OwnableResource | null
  ) => isOwner(user, apartment),

  respondToReview: (
    user: CurrentUser | null,
    apartment: OwnableResource | null
  ) => isOwner(user, apartment),

  // --- Maintenance (Owner or Staff) ---
  viewMaintenanceRequests: (
    user: CurrentUser | null,
    apartment: OwnableResource | null,
    staffList: StaffAssignment[] | null
  ) => isOwner(user, apartment) || isStaffOf(user, staffList),

  updateMaintenanceStatus: (
    user: CurrentUser | null,
    apartment: OwnableResource | null,
    staffList: StaffAssignment[] | null
  ) =>
    isOwner(user, apartment) ||
    hasStaffRole(user, staffList, "MaintenanceStaff"),

  // --- Admin ---
  accessAdminArea: (user: CurrentUser | null) => user?.role === "Admin",
}
