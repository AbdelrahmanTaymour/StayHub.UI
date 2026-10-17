import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { getApartmentStaffServer } from "@/features/apartments/api/apartment-staff.server"
import { StaffAssignmentsPanel } from "@/features/apartments/components/StaffAssignmentsPanel"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.tabs")
  return { title: t("staff") }
}

interface ApartmentStaffTabPageProps {
  params: Promise<{ apartmentId: string }>
}

export default async function ApartmentStaffTabPage({
  params,
}: ApartmentStaffTabPageProps) {
  const { apartmentId } = await params
  const staff = await getApartmentStaffServer(apartmentId)

  return (
    <StaffAssignmentsPanel apartmentId={apartmentId} initialStaff={staff} />
  )
}
