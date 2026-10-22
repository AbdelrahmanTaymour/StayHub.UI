import { z } from "zod"

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "required").max(50, "nameTooLong"),
  lastName: z.string().trim().min(1, "required").max(50, "nameTooLong"),
  bio: z.string().trim().max(500, "bioTooLong").optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .trim()
    .max(32, "phoneTooLong")
    .regex(/^[+\d][\d\s()-]*$/, "invalidPhone")
    .optional()
    .or(z.literal("")),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
