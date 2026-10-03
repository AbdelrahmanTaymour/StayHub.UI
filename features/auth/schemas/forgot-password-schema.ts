import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "required").pipe(z.email("invalidEmail")),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
