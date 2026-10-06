import { useLocale, useTranslations } from "next-intl"

import { StarRating } from "@/components/common/StarRating"
import { cn } from "cn"

interface RatingSummaryProps {
  rating?: number | null
  reviewCount?: number | null
  className?: string
}

export function RatingSummary({
  rating,
  reviewCount,
  className,
}: RatingSummaryProps) {
  const t = useTranslations("ratings")
  const locale = useLocale()

  if (rating == null) return null

  const formattedRating = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(rating)

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 text-sm",
        className
      )}
    >
      <StarRating value={rating} />
      <span className="font-medium text-foreground">{formattedRating}</span>
      <span className="text-foreground">
        · {t("reviewsCount", { count: reviewCount ?? 0 })}
      </span>
    </span>
  )
}
