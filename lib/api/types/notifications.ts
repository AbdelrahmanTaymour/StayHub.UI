import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type NotificationType =
  Schemas["StayHub.Domain.Notifications.NotificationType"]

export type MyNotificationsResponse =
  Schemas["StayHub.Application.Notifications.GetMyNotifications.MyNotificationsResponse"]
