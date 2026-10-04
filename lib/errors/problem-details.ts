import { ApiError } from "@/lib/errors/api-error"
import type {
  ProblemDetails,
  ValidationProblemDetails,
} from "@/lib/api/types/errors"

type Problem = ProblemDetails | ValidationProblemDetails

export function getProblem(error: unknown): Problem | undefined {
  const value = error instanceof ApiError ? error.problem : error
  return typeof value === "object" && value !== null
    ? (value as Problem)
    : undefined
}

export function isValidationProblem(
  error: unknown
): error is ValidationProblemDetails | ApiError {
  const problem = getProblem(error)
  return problem !== undefined && "errors" in problem
}

export function getErrorMessage(error: unknown): string {
  const problem = getProblem(error)

  if (problem && "errors" in problem) {
    const firstField = Object.values(problem.errors ?? {})[0]
    return firstField?.[0] ?? "Validation error"
  }

  if (problem && typeof problem.detail === "string") {
    return problem.detail
  }

  return "Something went wrong"
}
