import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type RegisterUserRequest =
  Schemas["StayHub.Api.Endpoints.Users.RegisterUserRequest"]

export type LogInUserRequest =
  Schemas["StayHub.Api.Endpoints.Users.LogInUserRequest"]

export type AccessTokenResponse =
  Schemas["StayHub.Application.Abstractions.Authentication.AccessTokenResponse"]

export type ForgotPasswordRequest =
  Schemas["StayHub.Api.Endpoints.Users.ForgotPasswordRequest"]

export type LogOutUserRequest =
  Schemas["StayHub.Api.Endpoints.Users.LogOutUserRequest"]

export type RefreshAccessTokenRequest =
  Schemas["StayHub.Api.Endpoints.Users.RefreshAccessTokenRequest"]
