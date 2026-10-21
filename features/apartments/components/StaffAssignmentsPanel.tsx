"use client"

import { AssignStaffCard } from "./AssignStaffCard"
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

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <AssignStaffCard apartmentId={apartmentId} staff={staff} />
        </div>
        <div className="lg:col-span-7">
          <ActiveStaffRoster apartmentId={apartmentId} staff={staff} />
        </div>
      </div>
    </div>
  )
}
