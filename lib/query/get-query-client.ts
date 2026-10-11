import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query"
import { cache } from "react"

/** One QueryClient per server request, so prefetches don't leak across requests. */
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
        dehydrate: {
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending",
        },
      },
    })
)
