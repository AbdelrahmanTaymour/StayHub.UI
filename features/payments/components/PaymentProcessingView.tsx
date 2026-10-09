import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"

export function PaymentProcessingView() {
  const t = useTranslations("payment.pending")

  return (
    <Card className="items-center gap-4 p-10 text-center">
      <div role="status">
        <Loader2
          aria-hidden="true"
          className="size-12 animate-spin text-tertiary motion-reduce:animate-none"
        />
        <span className="sr-only">{t("srStatus")}</span>
      </div>
      <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
      <p className="max-w-md text-sm text-foreground">{t("description")}</p>
    </Card>
  )
}
