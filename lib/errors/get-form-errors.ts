import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import { getErrorMessage, getProblem } from "@/lib/errors/problem-details"

/**
 * Applies an API error to a react-hook-form instance.
 *
 * - Field errors (ValidationProblemDetails.errors) are matched case-insensitively
 *   against `knownFields` and set with setError, so they render inline.
 * - Anything else is returned as form-level messages for <ValidationErrorList />.
 */
export function getFormErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  knownFields: readonly (keyof TFieldValues & string)[]
): string[] {
  const problem = getProblem(error)

  if (!problem || !("errors" in problem)) {
    return [getErrorMessage(error)]
  }

  const unmatched: string[] = []
  const lowerKnown = new Map(
    knownFields.map((field) => [field.toLowerCase(), field])
  )

  for (const [key, messages] of Object.entries(problem.errors ?? {})) {
    const message = messages?.[0]
    if (!message) continue

    const matchedField = lowerKnown.get(key.toLowerCase())
    if (matchedField) {
      setError(matchedField as Path<TFieldValues>, {
        type: "server",
        message,
      })
    } else {
      unmatched.push(message)
    }
  }

  return unmatched
}
