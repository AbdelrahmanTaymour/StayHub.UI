"use client"

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center"
    >
      <p className="text-lg font-semibold text-foreground">
        Something went wrong
      </p>
      <p className="text-sm text-foreground">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  )
}
