import { cn } from "cn"

interface ValidationErrorListProps {
  errors: string[]
  title?: string
  className?: string
}

/**
 * Shared surface for form-level errors that don't map to a specific field:
 * backend validation keys we don't recognize, or non-validation errors
 * (e.g. "invalid credentials") that have nowhere else to render. Field-level
 * errors still render inline under their own field — see
 * lib/errors/get-form-errors.ts, which decides what ends up here.
 */
export function ValidationErrorList({
  errors,
  title,
  className,
}: ValidationErrorListProps) {
  if (errors.length === 0) return null

  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
        className
      )}
    >
      {title ? <p className="mb-1 font-medium">{title}</p> : null}
      {errors.length === 1 ? (
        <p>{errors[0]}</p>
      ) : (
        <ul className="list-disc space-y-0.5 ps-4">
          {errors.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
