import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

// Error Shapes
export type ProblemDetails = Schemas["Microsoft.AspNetCore.Mvc.ProblemDetails"]
export type ValidationProblemDetails =
  Schemas["Microsoft.AspNetCore.Http.HttpValidationProblemDetails"]
