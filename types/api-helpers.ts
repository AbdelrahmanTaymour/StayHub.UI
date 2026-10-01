import type { components, operations } from "./api"

export type Schemas = components["schemas"]
export type Operations = operations

// AUTH
export type RegisterUserRequest =
  Schemas["StayHub.Api.Endpoints.Users.RegisterUserRequest"]

export type LogInUserRequest =
  Schemas["StayHub.Api.Endpoints.Users.LogInUserRequest"]

export type AccessTokenResponse =
  Schemas["StayHub.Application.Abstractions.Authentication.AccessTokenResponse"]

export type ForgotPasswordRequest =
  Schemas["StayHub.Api.Endpoints.Users.ForgotPasswordRequest"]

// USER
export type LoggedInUserResponse =
  Schemas["StayHub.Application.Users.GetLoggedInUser.LoggedInUserResponse"]

// APARTMENTS
export type ApartmentResponse =
  Schemas["StayHub.Application.Apartments.GetApartment.ApartmentResponse"]

export type ApartmentForEditResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentForEdit.ApartmentForEditResponse"]

export type MyApartmentsResponse =
  Schemas["StayHub.Application.Apartments.GetMyApartments.MyApartmentsResponse"]

export type MyApartmentsDashboardResponse =
  Schemas["StayHub.Application.Apartments.GetMyApartmentsDashboard.MyApartmentsDashboardResponse"]

export type UpdateApartmentRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.UpdateApartmentRequest"]

export type ApartmentStaffRole =
  Schemas["StayHub.Domain.Apartments.ApartmentStaffRole"]

export type ApartmentStaffResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentStaff.ApartmentStaffResponse"]

// Error Shapes
export type ProblemDetails = Schemas["Microsoft.AspNetCore.Mvc.ProblemDetails"]
export type ValidationProblemDetails =
  Schemas["Microsoft.AspNetCore.Http.HttpValidationProblemDetails"]
