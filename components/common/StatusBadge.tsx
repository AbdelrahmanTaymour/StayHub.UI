import { useTranslations } from "next-intl"

import { cn } from "cn"
import type { StatusTone } from "@/lib/status/status-config"

interface StatusConfig {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  tone: StatusTone
}

interface StatusBadgeProps<T extends string> {
  status: T
  config: Record<T, StatusConfig>
  namespace: string
  className?: string
}

const TONE_CLASSES: Record<StatusTone, { badge: string; dot: string }> = {
  success: {
    badge:
      "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  warning: {
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  destructive: {
    badge: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  info: {
    badge: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    dot: "bg-sky-500",
  },
}

/**
 * Status is always carried by the text label, never by color alone (dot +
 * text, both localized) — color is an additional cue, not the only one.
 */
export function StatusBadge<T extends string>({
  status,
  config,
  namespace,
  className,
}: StatusBadgeProps<T>) {
  const t = useTranslations(namespace)
  const { label, tone } = config[status]
  const toneClasses = TONE_CLASSES[tone]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        toneClasses.badge,
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 rounded-full", toneClasses.dot)}
      />
      {t(label)}
    </span>
  )
}
