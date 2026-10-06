import * as React from "react"

import { cn } from "cn"

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "aside"
}

/** Surface for grouped content. Use `as="section"` with aria-labelledby for page sections. */
function Card({ as = "div", className, ...props }: CardProps) {
  const Component: React.ElementType = as

  return (
    <Component
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { Card }
