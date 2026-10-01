export type GlobalRole = "Guest" | "Admin"

export interface CurrentUser {
  id: string
  role: GlobalRole
}

export interface OwnableResource {
  ownerId: string
}

export interface StaffAssignment {
  userId: string
  role: "Manager" | "Cleaner" | "MaintenanceStaff"
}
