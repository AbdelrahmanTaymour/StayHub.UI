import { z } from "zod"

const amountPattern = /^\d+(\.\d+)?$/

export const editApartmentSchema = z.object({
  title: z.string().trim().min(1, "required").max(200, "titleTooLong"),
  description: z
    .string()
    .trim()
    .min(1, "required")
    .max(2000, "descriptionTooLong"),
  nightlyRate: z
    .string()
    .trim()
    .min(1, "required")
    .refine((v) => amountPattern.test(v), "mustBePositive")
    .transform(Number)
    .refine((v) => v > 0, "mustBePositive"),
  cleaningFee: z
    .string()
    .trim()
    .min(1, "required")
    .refine((v) => amountPattern.test(v), "mustBeNonNegative")
    .transform(Number)
    .refine((v) => v >= 0, "mustBeNonNegative"),
  currency: z.string().min(1, "required"),
})

export type EditApartmentFormInput = z.input<typeof editApartmentSchema>
export type EditApartmentFormValues = z.output<typeof editApartmentSchema>
