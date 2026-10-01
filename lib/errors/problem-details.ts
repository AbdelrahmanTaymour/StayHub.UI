import type {
  ProblemDetails,
  ValidationProblemDetails,
} from "@/types/api-helpers"

export function isValidationProblem(
  error: unknown
): error is ValidationProblemDetails {
  return typeof error === "object" && error !== null && "errors" in error
}

export function getErrorMessage(error: unknown): string {
  if (isValidationProblem(error)) {
    const firstField = Object.values(error.errors ?? {})[0]
    return firstField?.[0] ?? "Validation error"
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof (error as ProblemDetails).detail === "string"
  ) {
    return (error as ProblemDetails).detail as string
  }

  return "Something went wrong"
}
