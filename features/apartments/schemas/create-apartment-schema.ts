import { z } from "zod"

const currencySchema = z.string().min(1, "required")
const amountPattern = /^\d+(\.\d+)?$/

export const createApartmentSchema = z.object({
  name: z.string().trim().min(1, "required"),
  description: z.string().trim().min(1, "required"),
  street: z.string().trim().min(1, "required"),
  city: z.string().trim().min(1, "required"),
  state: z.string().trim().min(1, "required"),
  zipCode: z.string().trim().min(1, "required"),
  country: z.string().trim().min(1, "required"),
  priceAmount: z
    .string()
    .trim()
    .min(1, "required")
    .refine((v) => amountPattern.test(v), "mustBePositive")
    .transform(Number)
    .refine((v) => v > 0, "mustBePositive"),
  priceCurrency: currencySchema,
  cleaningFeeAmount: z
    .string()
    .trim()
    .min(1, "required")
    .refine((v) => amountPattern.test(v), "mustBeNonNegative")
    .transform(Number)
    .refine((v) => v >= 0, "mustBeNonNegative"),
  cleaningFeeCurrency: currencySchema,
})

export type CreateApartmentFormInput = z.input<typeof createApartmentSchema>
export type CreateApartmentFormValues = z.output<typeof createApartmentSchema>
