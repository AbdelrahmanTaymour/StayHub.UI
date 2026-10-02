import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"

interface StatusConfig {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
}

interface StatusBadgeProps<T extends string> {
  status: T
  config: Record<T, StatusConfig>
  namespace: string
}

export function StatusBadge<T extends string>({
  status,
  config,
  namespace,
}: StatusBadgeProps<T>) {
  const t = useTranslations(namespace)
  const { label, variant } = config[status]

  return <Badge variant={variant}>{t(label)}</Badge>
}
