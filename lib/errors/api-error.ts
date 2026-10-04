import type {
  ProblemDetails,
  ValidationProblemDetails,
} from "@/lib/api/types/errors"

export class ApiError extends Error {
  readonly status: number
  readonly problem: ProblemDetails | ValidationProblemDetails

  constructor(
    status: number,
    problem: ProblemDetails | ValidationProblemDetails
  ) {
    super(
      problem.detail ?? problem.title ?? `Request failed with status ${status}`
    )
    this.name = "ApiError"
    this.status = status
    this.problem = problem
  }
}

interface ClientResult<TData> {
  data?: TData
  error?: unknown
  response: Response
}

/**
 * Turns an openapi-fetch result into its data, or throws an ApiError.
 * Use it in every API function so errors are handled the same way everywhere.
 */
export function unwrap<TData>({
  data,
  error,
  response,
}: ClientResult<TData>): TData {
  if (error !== undefined) {
    const problem =
      typeof error === "object" && error !== null
        ? (error as ProblemDetails | ValidationProblemDetails)
        : { title: "Request failed" }
    throw new ApiError(response.status, problem)
  }
  return data as TData
}
