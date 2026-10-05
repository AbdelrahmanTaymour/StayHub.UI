import type { ReactNode } from "react"

import { cn } from "cn"

interface PageHeaderProps {
  title: string
  meta?: ReactNode
  actions?: ReactNode
  className?: string
}

/** Shared page title block: heading, optional metadata line, and actions. */
export function PageHeader({
  title,
  meta,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {meta ? (
          <div className="text-sm text-muted-foreground">{meta}</div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
