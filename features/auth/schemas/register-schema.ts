import { z } from "zod"

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "required"),
    lastName: z.string().trim().min(1, "required"),
    email: z.string().trim().min(1, "required").pipe(z.email("invalidEmail")),
    password: z.string().min(8, "passwordTooShort"),
    confirmPassword: z.string().min(1, "required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "passwordsDontMatch",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
