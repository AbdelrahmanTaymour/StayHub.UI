import { CreditCard, RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function PaymentFailedView({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("payment.failed")

  return (
    <Card className="items-center gap-4 p-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CreditCard aria-hidden="true" className="size-7" />
      </span>
      <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
      <p className="max-w-md text-sm text-foreground">{t("description")}</p>

      <Button type="button" size="lg" onClick={onRetry} className="gap-2">
        <RotateCcw aria-hidden="true" className="size-4" />
        {t("retry")}
      </Button>
    </Card>
  )
}
