import { Construction } from "lucide-react"

interface ComingSoonPanelProps {
  title: string
  description: string
}

export function ComingSoonPanel({ title, description }: ComingSoonPanelProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-12 text-center">
      <Construction aria-hidden="true" className="size-8 text-foreground/50" />
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-md text-sm text-foreground/70">{description}</p>
    </div>
  )
}
