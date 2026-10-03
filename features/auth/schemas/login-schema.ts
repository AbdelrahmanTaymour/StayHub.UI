import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().min(1, "required").pipe(z.email("invalidEmail")),
  password: z.string().min(1, "required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
