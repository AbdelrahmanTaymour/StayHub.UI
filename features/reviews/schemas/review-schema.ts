import { z } from "zod"

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "ratingRequired").max(5),
  comment: z
    .string()
    .trim()
    .min(1, "commentRequired")
    .max(2000, "commentTooLong"),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
