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
