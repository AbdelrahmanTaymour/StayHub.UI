import type { ReactNode } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "cn"

export interface LedgerRow {
  label: ReactNode
  value: ReactNode
  emphasized?: boolean
}

interface SummaryActionCardProps {
  header?: ReactNode
  ledger?: LedgerRow[]
  actions?: ReactNode
  footnote?: ReactNode
  className?: string
}

/**
 * Shared sticky sidebar shape: price header, optional ledger, stacked
 * actions, optional footnote. Used by the apartment booking card, the
 * booking detail payment breakdown, and the payment page's order summary.
 */
export function SummaryActionCard({
  header,
  ledger,
  actions,
  footnote,
  className,
}: SummaryActionCardProps) {
  return (
    <Card className={cn("gap-6", className)}>
      {header}

      {ledger && ledger.length > 0 ? (
        <dl className="flex flex-col gap-2 text-sm">
          {ledger.map((row, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between gap-4",
                row.emphasized &&
                  "rounded-xl bg-muted p-4 font-semibold text-foreground"
              )}
            >
              <dt className="text-foreground">{row.label}</dt>
              <dd className="text-foreground tabular-nums">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {actions ? <div className="flex flex-col gap-2">{actions}</div> : null}
      {footnote ? (
        <div className="text-sm text-foreground">{footnote}</div>
      ) : null}
    </Card>
  )
}
