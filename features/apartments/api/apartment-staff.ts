import { apiClient } from "@/lib/api/client"
import {
  AssignApartmentStaffRequest,
  InviteStaffRequest,
} from "@/lib/api/types/apartments"

export async function getApartmentStaff(apartmentId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/{apartmentId}/staff",
    { params: { path: { apartmentId } } }
  )
  if (error) throw error
  return data
}

export async function assignApartmentStaff(
  id: string,
  body: AssignApartmentStaffRequest
) {
  const { data, error } = await apiClient.POST(
    "/api/v1/apartments/{id}/staff",
    {
      params: { path: { id } },
      body,
    }
  )
  if (error) throw error
  return data
}

export async function removeApartmentStaff(assignmentId: string) {
  const { error } = await apiClient.DELETE(
    "/api/v1/apartments/staff/{assignmentId}",
    { params: { path: { assignmentId } } }
  )
  if (error) throw error
}

export async function searchStaffCandidate(apartmentId: string, email: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/{apartmentId}/staff/search",
    { params: { path: { apartmentId }, query: { email } } }
  )
  if (error) throw error
  return data
}

export async function inviteStaff(id: string, body: InviteStaffRequest) {
  const { error } = await apiClient.POST(
    "/api/v1/apartments/{id}/staff/invite",
    {
      params: { path: { id } },
      body,
    }
  )
  if (error) throw error
}

/*
type AssignApartmentStaffRequest = {
    staffUserId?: string; // uuid
    role?: ApartmentStaffRole;
}

type InviteStaffRequest = {
    email?: string | null;
    body?: string | null;
}

type ApartmentStaffRole = "Manager" | "Cleaner" | "MaintenanceStaff"
// Manager: can manage bookings/listing details on the owner's behalf
// Cleaner: handles turnover/cleaning between stays
// MaintenanceStaff: handles maintenance requests for the apartment

// Responses

type GetApartmentStaffResponse = ApartmentStaffResponse[]
type ApartmentStaffResponse = {
    assignmentId?: string; // uuid
    userId?: string; // uuid
    fullName?: string | null;
    avatarUrl?: string | null;
    phoneNumber?: string | null;
    role?: ApartmentStaffRole;
    assignedOnUtc?: string; // date-time
}

type AssignApartmentStaffResponse = string // new assignment id (uuid)

type RemoveApartmentStaffResponse = void // 204 No Content

type SearchStaffCandidateResponse = StaffCandidateResponse
type StaffCandidateResponse = {
    userId?: string; // uuid
    fullName?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    phoneNumber?: string | null;
    isApartmentOwner?: boolean;
    isAlreadyAssigned?: boolean;
    currentRole?: ApartmentStaffRole;
}

type InviteStaffResponse = void // 204 No Content
*/
