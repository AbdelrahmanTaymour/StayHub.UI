"use client"

import { Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { useId, useState } from "react"

import { cn } from "cn"

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  "aria-describedby"?: string
  "aria-invalid"?: boolean
}

const STARS = [1, 2, 3, 4, 5] as const

export function StarRatingInput({
  value,
  onChange,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: StarRatingInputProps) {
  const t = useTranslations("reviews.rating")
  const groupId = useId()
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const displayValue = hoverValue ?? value

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault()
      onChange(Math.min(5, (value || 0) + 1))
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault()
      onChange(Math.max(1, (value || 1) - 1))
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("label")}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-labelledby={groupId}
      className="flex items-center gap-1"
      onMouseLeave={() => setHoverValue(null)}
      onKeyDown={handleKeyDown}
    >
      <span id={groupId} className="sr-only">
        {t("label")}
      </span>
      {STARS.map((star) => {
        const isSelected = star === value
        const isFilled = star <= displayValue

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={t("starLabel", { count: star })}
            tabIndex={star === (value || 1) ? 0 : -1}
            onMouseEnter={() => setHoverValue(star)}
            onClick={() => onChange(star)}
            className="rounded-sm p-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Star
              aria-hidden="true"
              className={cn(
                "size-8 transition-colors",
                isFilled ? "fill-rating text-rating" : "text-border"
              )}
            />
          </button>
        )
      })}
      <span className="sr-only" aria-live="polite">
        {value > 0 ? t("selectedLabel", { count: value }) : t("noneSelected")}
      </span>
    </div>
  )
}
