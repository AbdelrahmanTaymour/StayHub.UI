import { z } from "zod"

export const credentialsSchema = z.object({
  email: z.string().min(1, "Email is required").pipe(z.email("Invalid email")),
  password: z.string().min(1, "Password is required"),
})
