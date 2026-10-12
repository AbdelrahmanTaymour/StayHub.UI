type MetricCardProps = {
  icon: React.ReactNode
  iconClassName?: string
  label: string
  value: React.ReactNode
  footnote?: React.ReactNode
}

export function MetricCard({
  icon,
  iconClassName,
  label,
  value,
  footnote,
}: MetricCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span
          className={`flex size-8 items-center justify-center rounded-lg bg-muted text-tertiary ${iconClassName ?? ""}`}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {footnote ? (
          <div className="mt-1 text-sm text-foreground/70">{footnote}</div>
        ) : null}
      </div>
    </div>
  )
}
