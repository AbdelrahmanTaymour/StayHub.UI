import * as React from "react"

import { cn } from "cn"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Single shared empty-state treatment, used across the app (search results,
 * favorites, bookings, conversations, etc.) so every "nothing here yet"
 * screen reads the same way. Announced via role="status" for assistive tech.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center",
        className
      )}
    >
      {icon ? (
        <div className="text-foreground" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
