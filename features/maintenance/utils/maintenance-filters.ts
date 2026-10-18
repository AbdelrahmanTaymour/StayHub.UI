import type { QueryParameters } from "@/lib/api/type-utils"

type Query = QueryParameters<
  "/api/v1/apartments/{id}/maintenance-requests",
  "get"
>
export type MaintenanceStatusFilter = NonNullable<Query["status"]> | "All"

export const MAINTENANCE_TABS = [
  "All",
  "Open",
  "InProgress",
  "Resolved",
  "Closed",
] as const satisfies readonly MaintenanceStatusFilter[]
export const DEFAULT_MAINTENANCE_TAB: MaintenanceStatusFilter = "All"

export function getMaintenanceFilter(
  value: string | undefined
): MaintenanceStatusFilter {
  return MAINTENANCE_TABS.find((v) => v === value) ?? DEFAULT_MAINTENANCE_TAB
}
// features/maintenance/schemas/create-maintenance-request-schema.ts
import { z } from "zod"

export const createMaintenanceRequestSchema = z.object({
  title: z.string().trim().min(1, "required").max(200, "titleTooLong"),
  description: z
    .string()
    .trim()
    .min(1, "required")
    .max(2000, "descriptionTooLong"),
})

export type CreateMaintenanceRequestFormValues = z.infer<
  typeof createMaintenanceRequestSchema
>
