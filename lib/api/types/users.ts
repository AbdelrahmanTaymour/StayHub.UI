import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type LoggedInUserResponse =
  Schemas["StayHub.Application.Users.GetLoggedInUser.LoggedInUserResponse"]

export type UpdateUserNameRequest =
  Schemas["StayHub.Api.Endpoints.Users.UpdateUserNameRequest"]

export type UpdateUserProfileRequest =
  Schemas["StayHub.Api.Endpoints.Users.UpdateUserProfileRequest"]

export type UserResponse =
  Schemas["StayHub.Application.Users.GetUser.UserResponse"]

export type UserProfileResponse =
  Schemas["StayHub.Application.Users.GetOwnerProfile.UserProfileResponse"]

export type UserSessionResponse =
  Schemas["StayHub.Application.Users.GetUserSessions.UserSessionResponse"]
