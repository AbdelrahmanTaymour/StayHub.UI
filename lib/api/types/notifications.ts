import type { components, operations, paths } from "../generated/api"
import { QueryParameters } from "../type-utils"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type GetNotificationsQuery = QueryParameters<
  "/api/v1/notifications",
  "get"
>

export type NotificationType =
  Schemas["StayHub.Domain.Notifications.NotificationType"]

export type MyNotificationsResponse =
  Schemas["StayHub.Application.Notifications.GetMyNotifications.MyNotificationsResponse"]
