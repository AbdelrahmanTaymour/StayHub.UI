import type { paths } from "@/lib/api/generated/api"

/**
 * Extracts the `query` parameters type for a given path + HTTP method
 * straight from the generated `paths` type, so query param types always
 * stay in sync with the OpenAPI spec without relying on named `operations`
 * (which aren't defined for every endpoint in the generated file).
 *
 * Resolves to `undefined` if the endpoint has no query parameters, and
 * `never` if the path/method combination doesn't exist at all — both of
 * which surface as compile-time errors if misused.
 *
 * @example
 * type SearchApartmentsQuery = QueryParameters<"/api/v1/apartments", "get">
 */
export type QueryParameters<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
> = paths[TPath][TMethod] extends {
  parameters?: {
    query?: infer TQuery
  }
}
  ? TQuery
  : never
