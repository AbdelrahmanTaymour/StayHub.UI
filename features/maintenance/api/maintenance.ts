import { apiClient } from "@/lib/api/client"
import { QueryParameters } from "@/lib/api/type-utils"
import {
  AssignMaintenanceRequestStaffRequest,
  CreateMaintenanceRequestRequest,
} from "@/lib/api/types/maintenance"

type ApartmentMaintenanceRequestsQuery = QueryParameters<
  "/api/v1/apartments/{id}/maintenance-requests",
  "get"
>

export async function getApartmentMaintenanceRequests(
  id: string,
  query?: ApartmentMaintenanceRequestsQuery
) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/{id}/maintenance-requests",
    { params: { path: { id }, query } }
  )
  if (error) throw error
  return data
}

export async function createMaintenanceRequest(
  id: string,
  body: CreateMaintenanceRequestRequest
) {
  const { data, error } = await apiClient.POST(
    "/api/v1/apartments/{id}/maintenance-requests",
    { params: { path: { id } }, body }
  )
  if (error) throw error
  return data
}

export async function getMaintenanceRequest(requestId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/maintenance-requests/{requestId}",
    { params: { path: { requestId } } }
  )
  if (error) throw error
  return data
}

export async function getMaintenanceRequestForGuest(requestId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/apartments/maintenance-requests/{requestId}/guest",
    { params: { path: { requestId } } }
  )
  if (error) throw error
  return data
}

export async function startMaintenanceRequest(requestId: string) {
  const { error } = await apiClient.POST(
    "/api/v1/apartments/maintenance-requests/{requestId}/start",
    { params: { path: { requestId } } }
  )
  if (error) throw error
}

export async function resolveMaintenanceRequest(requestId: string) {
  const { error } = await apiClient.POST(
    "/api/v1/apartments/maintenance-requests/{requestId}/resolve",
    { params: { path: { requestId } } }
  )
  if (error) throw error
}

export async function closeMaintenanceRequest(requestId: string) {
  const { error } = await apiClient.POST(
    "/api/v1/apartments/maintenance-requests/{requestId}/close",
    { params: { path: { requestId } } }
  )
  if (error) throw error
}

export async function assignMaintenanceRequestStaff(
  requestId: string,
  body: AssignMaintenanceRequestStaffRequest
) {
  const { error } = await apiClient.POST(
    "/api/v1/apartments/maintenance-requests/{requestId}/assign",
    { params: { path: { requestId } }, body }
  )
  if (error) throw error
}

/*
type CreateMaintenanceRequestRequest = {
    title?: string | null;
    description?: string | null;
}

type AssignMaintenanceRequestStaffRequest = {
    staffUserId?: string; // uuid
}

type ApartmentMaintenanceRequestsQuery = {
    search?: string; // free-text search over title/description
    status?: MaintenanceRequestStatus; // filter to a single request status
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}

type MaintenanceRequestStatus = "Open" | "InProgress" | "Resolved" | "Closed"
// Open: reported, not yet started
// InProgress: staff has started work on it
// Resolved: work is done, awaiting closure/confirmation
// Closed: request fully closed out

// Responses

type GetApartmentMaintenanceRequestsResponse = MaintenanceRequestsResponse[]
type MaintenanceRequestsResponse = {
    id?: string; // uuid
    title?: string | null;
    status?: MaintenanceRequestStatus;
    createdOnUtc?: string; // date-time
    reportedByUserId?: string; // uuid
    reporterFirstName?: string | null;
    reporterLastName?: string | null;
    reporterAvatarUrl?: string | null;
    isReportedByOwner?: boolean;
}

type CreateMaintenanceRequestResponse = string // new request id (uuid)

type GetMaintenanceRequestResponse = MaintenanceRequestResponse
type MaintenanceRequestResponse = {
    id?: string; // uuid
    apartmentId?: string; // uuid
    apartmentName?: string | null;
    apartmentCity?: string | null;
    title?: string | null;
    description?: string | null;
    status?: MaintenanceRequestStatus;
    createdOnUtc?: string; // date-time
    startOnUtc?: string | null; // date-time
    resolvedOnUtc?: string | null; // date-time
    closedOnUtc?: string | null; // date-time
    reportedByUserId?: string; // uuid
    reporterFirstName?: string | null;
    reporterLastName?: string | null;
    reporterEmail?: string | null;
    reporterPhoneNumber?: string | null;
    reporterAvatarUrl?: string | null;
    assignedToUserId?: string | null; // uuid
}

type GetMaintenanceRequestForGuestResponse = GuestMaintenanceRequestResponse
type GuestMaintenanceRequestResponse = {
    id?: string; // uuid
    apartmentId?: string; // uuid
    apartmentName?: string | null;
    apartmentCity?: string | null;
    title?: string | null;
    description?: string | null;
    status?: MaintenanceRequestStatus;
    createdOnUtc?: string; // date-time
    startOnUtc?: string | null; // date-time
    inProgressOnUtc?: string | null; // date-time
    resolvedOnUtc?: string | null; // date-time
    closedOnUtc?: string | null; // date-time
}

type StartMaintenanceRequestResponse = void // 204 No Content
type ResolveMaintenanceRequestResponse = void // 204 No Content
type CloseMaintenanceRequestResponse = void // 204 No Content
type AssignMaintenanceRequestStaffResponse = void // 204 No Content
*/
