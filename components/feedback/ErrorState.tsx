import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

interface ErrorStateProps {
  title: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

/**
 * Shared treatment for business-rule / request failures that aren't a form
 * validation error (see §7.8 of the product spec: validation errors map to
 * fields, everything else is a single prominent message). role="alert" so
 * screen readers announce it immediately.
 */
export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center",
        className
      )}
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-foreground">{description}</p>
      ) : null}
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-2"
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
