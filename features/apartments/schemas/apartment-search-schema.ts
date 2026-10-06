import { DateRangeValue } from "@/components/common/DateRangePicker"
import { z } from "zod"

const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0))

const optionalPrice = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d+(\.\d+)?$/.test(value),
    "invalidNumber"
  )
  .transform((value) => (value === "" ? undefined : Number(value)))

const staySchema = z
  .custom<DateRangeValue | undefined>(
    (value) =>
      value === undefined ||
      (typeof value === "object" &&
        value !== null &&
        "from" in value &&
        "to" in value)
  )
  .optional()

export const apartmentSearchSchema = z
  .object({
    city: z.string().trim(),
    stay: staySchema,
    minPrice: optionalPrice,
    maxPrice: optionalPrice,
  })
  .superRefine((values, ctx) => {
    const { from, to } = values.stay ?? {}

    if (from && !to) {
      ctx.addIssue({
        code: "custom",
        path: ["stay"],
        message: "datesIncomplete",
      })
    } else if (from && to && from < startOfToday()) {
      ctx.addIssue({ code: "custom", path: ["stay"], message: "pastDate" })
    } else if (from && to && to <= from) {
      ctx.addIssue({
        code: "custom",
        path: ["stay"],
        message: "endBeforeStart",
      })
    }

    if (
      values.minPrice !== undefined &&
      values.maxPrice !== undefined &&
      values.maxPrice < values.minPrice
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxPrice"],
        message: "maxBelowMin",
      })
    }
  })

export type ApartmentSearchFormValues = z.output<typeof apartmentSearchSchema>
export type ApartmentSearchFormInput = z.input<typeof apartmentSearchSchema>
