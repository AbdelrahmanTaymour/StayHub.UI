"use client"

import { ActiveStaffRoster } from "./ActiveStaffRoster"
import { useApartmentStaff } from "../hooks/useApartmentStaff"
import { ApartmentStaffResponse } from "@/lib/api/types/apartments"

interface StaffAssignmentsPanelProps {
  apartmentId: string
  initialStaff: ApartmentStaffResponse[]
}

export function StaffAssignmentsPanel({
  apartmentId,
  initialStaff,
}: StaffAssignmentsPanelProps) {
  const { data: staff } = useApartmentStaff(apartmentId, initialStaff)

  return <ActiveStaffRoster apartmentId={apartmentId} staff={staff ?? []} />
}
