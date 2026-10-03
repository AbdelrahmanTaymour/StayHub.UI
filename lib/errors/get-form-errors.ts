import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import {
  getErrorMessage,
  isValidationProblem,
} from "@/lib/errors/problem-details"

/**
 * Applies a thrown API error to a react-hook-form instance.
 *
 * - Field-level errors (ASP.NET `ValidationProblemDetails.errors`) are
 *   matched case-insensitively against `knownFields` and set via
 *   `setError`, so they render inline exactly like client-side zod errors.
 * - Anything that doesn't match a known field — an unrecognized validation
 *   key, or a non-validation error entirely (e.g. 401 invalid credentials,
 *   which isn't a ValidationProblemDetails at all) — is returned as a list
 *   of form-level messages, meant for <ValidationErrorList />.
 */
export function getFormErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  knownFields: readonly (keyof TFieldValues & string)[]
): string[] {
  if (!isValidationProblem(error)) {
    return [getErrorMessage(error)]
  }

  const unmatched: string[] = []
  const lowerKnown = new Map(
    knownFields.map((field) => [field.toLowerCase(), field])
  )

  for (const [key, messages] of Object.entries(error.errors ?? {})) {
    const message = messages?.[0]
    if (!message) continue

    const matchedField = lowerKnown.get(key.toLowerCase())
    if (matchedField) {
      setError(matchedField as Path<TFieldValues>, { type: "server", message })
    } else {
      unmatched.push(message)
    }
  }

  return unmatched
}
