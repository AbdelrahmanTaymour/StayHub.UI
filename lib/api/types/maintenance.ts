import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type MaintenanceRequestStatus =
  Schemas["StayHub.Domain.Maintenance.MaintenanceRequestStatus"]

export type CreateMaintenanceRequestRequest =
  Schemas["StayHub.Api.Endpoints.Maintenance.CreateMaintenanceRequestRequest"]

export type AssignMaintenanceRequestStaffRequest =
  Schemas["StayHub.Api.Endpoints.Maintenance.MaintenanceEndpoints.AssignMaintenanceRequestStaffRequest"]

export type MaintenanceRequestsResponse =
  Schemas["StayHub.Application.Maintenance.GetApartmentMaintenanceRequests.MaintenanceRequestsResponse"]

export type MaintenanceRequestResponse =
  Schemas["StayHub.Application.Maintenance.GetMaintenanceRequest.MaintenanceRequestResponse"]

export type GuestMaintenanceRequestResponse =
  Schemas["StayHub.Application.Maintenance.GetMaintenanceRequestForGuest.GuestMaintenanceRequestResponse"]
