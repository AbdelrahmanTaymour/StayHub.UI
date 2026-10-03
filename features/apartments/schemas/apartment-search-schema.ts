import { z } from "zod"

/**
 * Number inputs always submit a string (or "" when empty) — modeling the
 * field as `z.string().optional().transform(...)` instead of
 * `z.preprocess(...)` keeps the *input* type an explicit `string | undefined`
 * (what React Hook Form actually binds to the <input>) instead of
 * `unknown`. z.preprocess's input type is always `unknown`, which is what
 * broke zodResolver's generic match against useForm's field types.
 */
function optionalNumberField(opts?: { positive?: boolean }) {
  return z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === "") return undefined

      const parsed = Number(value)
      if (Number.isNaN(parsed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "invalidNumber" })
        return z.NEVER
      }
      if (opts?.positive && parsed <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "mustBePositive" })
        return z.NEVER
      }
      if (!opts?.positive && parsed < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "mustBeNonNegative",
        })
        return z.NEVER
      }
      return parsed
    })
}

// Refinement "messages" below are lookup codes, not translation keys — the
// form maps each code to a literal t("errors.<code>") call so every string
// shown to the user still goes through next-intl's typed translations.
export const apartmentSearchSchema = z
  .object({
    city: z.string().trim().optional(),
    minPrice: optionalNumberField(),
    maxPrice: optionalNumberField({ positive: true }),
    start: z.string().optional(),
    end: z.string().optional(),
  })
  .refine(
    (values) =>
      values.minPrice === undefined ||
      values.maxPrice === undefined ||
      values.maxPrice >= values.minPrice,
    { message: "maxBelowMin", path: ["maxPrice"] }
  )
  .refine((values) => Boolean(values.start) === Boolean(values.end), {
    message: "datesIncomplete",
    path: ["end"],
  })
  .refine(
    (values) => !values.start || !values.end || values.end > values.start,
    { message: "endBeforeStart", path: ["end"] }
  )

// What the <form> actually binds to (every field is a string, matching real
// <input> values).
export type ApartmentSearchFormInput = z.input<typeof apartmentSearchSchema>
// What you get in onSubmit after zod parses + transforms it.
export type ApartmentSearchFormValues = z.output<typeof apartmentSearchSchema>
