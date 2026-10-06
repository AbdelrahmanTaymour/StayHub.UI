import { Star } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "cn"

const MAX_STARS = 5

interface StarRatingProps {
  value: number
  className?: string
}

export function StarRating({ value, className }: StarRatingProps) {
  const t = useTranslations("ratings")
  const locale = useLocale()
  const filledStars = Math.round(value)
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value)

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span className="sr-only">{t("ratedOutOf", { rating: formatted })}</span>
      <span aria-hidden="true" className="inline-flex items-center gap-0.5">
        {Array.from({ length: MAX_STARS }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              index < filledStars ? "fill-rating text-rating" : "text-border"
            )}
          />
        ))}
      </span>
    </span>
  )
}
