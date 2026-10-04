"use client"

import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query"

import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/errors/problem-details"

/**
 * Options for configuring the `useApiMutation` hook.
 *
 * Extends `@tanstack/react-query`'s `UseMutationOptions`, omitting default
 * callback handlers (`onSuccess`, `onError`, `onSettled`) to inject standardized UI behaviors.
 *
 * @template TData The shape of the data returned by the mutation function.
 * @template TVariables The shape of the input variables passed to the mutation function.
 * @template TContext The context object passed to mutation lifecycle callbacks (e.g., optimistic updates).
 */
export type ApiMutationOptions<TData, TVariables, TContext = unknown> = Omit<
  UseMutationOptions<TData, unknown, TVariables, TContext>,
  "onSuccess" | "onError" | "onSettled"
> & {
  /**
   * List of `@tanstack/react-query` query keys to invalidate automatically
   * when the mutation completes (regardless of success or failure).
   *
   * @example
   * invalidate: [["users"], ["user", id]]
   */
  invalidate?: QueryKey[]

  /**
   * Static title string or resolver function for the success toast notification.
   * If provided, a success toast is automatically dispatched when the mutation succeeds.
   *
   * @example Static string
   * successMessage: "User updated successfully!"
   *
   * @example Resolver function
   * successMessage: (data, variables) => `User ${data.name} created!`
   */
  successMessage?: string | ((data: TData, variables: TVariables) => string)

  /**
   * Custom message for the error toast notification.
   * If omitted, defaults to parsing the error using `getErrorMessage(error)` (RFC 7807 problem details fallback).
   */
  errorMessage?: string

  /**
   * Callback fired after the mutation succeeds and the success toast has been dispatched.
   *
   * @param data The resolved data returned by `mutationFn`.
   * @param variables The variables passed into `mutate` or `mutateAsync`.
   * @param context The context returned from `onMutate` (if configured).
   */
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined
  ) => void | Promise<void>

  /**
   * Callback fired after the mutation fails and the error toast has been dispatched.
   *
   * @param error The thrown error or rejected promise value.
   * @param variables The variables passed into `mutate` or `mutateAsync`.
   * @param context The context returned from `onMutate` (if configured).
   */
  onError?: (
    error: unknown,
    variables: TVariables,
    context: TContext | undefined
  ) => void
}

/**
 * Custom wrapper around TanStack Query's `useMutation` hook that provides app-wide defaults:
 * - Dispatches a success toast if `successMessage` is provided.
 * - Dispatches an error toast automatically using `errorMessage` or RFC 7807 problem details parsing.
 * - Automatically invalidates specified `invalidate` query keys during `onSettled`.
 *
 * @template TData The expected payload type returned by the API response.
 * @template TVariables The parameters/variables required by the API request handler.
 * @template TContext Optional optimistic context state type.
 *
 * @param options Configuration options for the mutation, toasts, and query invalidation.
 * @returns The standard `UseMutationResult` object from `@tanstack/react-query`.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useApiMutation({
 *   mutationFn: (user: CreateUserInput) => api.createUser(user),
 *   successMessage: (data) => `User ${data.name} created!`,
 *   invalidate: [["users"]],
 *   onSuccess: (data) => router.push(`/users/${data.id}`),
 * })
 * ```
 */
export function useApiMutation<TData, TVariables, TContext = unknown>({
  invalidate = [],
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  ...options
}: ApiMutationOptions<TData, TVariables, TContext>) {
  const queryClient = useQueryClient()

  return useMutation<TData, unknown, TVariables, TContext>({
    ...options,

    onSuccess: async (data, variables, context) => {
      if (successMessage) {
        toast.add({
          title:
            typeof successMessage === "function"
              ? successMessage(data, variables)
              : successMessage,
          type: "success",
        })
      }
      await onSuccess?.(data, variables, context)
    },

    onError: (error, variables, context) => {
      toast.add({
        title: errorMessage ?? getErrorMessage(error),
        type: "error",
      })
      onError?.(error, variables, context)
    },

    onSettled: () => {
      for (const queryKey of invalidate) {
        void queryClient.invalidateQueries({ queryKey })
      }
    },
  })
}
