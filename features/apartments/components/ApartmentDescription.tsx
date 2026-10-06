"use client"

import { useId, useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "cn"

const COLLAPSE_THRESHOLD = 320

interface ApartmentDescriptionProps {
  description?: string | null
}

export function ApartmentDescription({
  description,
}: ApartmentDescriptionProps) {
  const t = useTranslations("apartmentDetails.description")
  const headingId = useId()
  const contentId = useId()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!description) return null

  const isLong = description.length > COLLAPSE_THRESHOLD
  const isCollapsed = isLong && !isExpanded

  return (
    <Card as="section" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-lg font-semibold text-foreground">
        {t("title")}
      </h2>

      <div id={contentId}>
        <p
          className={cn(
            "text-sm leading-relaxed whitespace-pre-line text-foreground",
            isCollapsed && "line-clamp-4"
          )}
        >
          {description}
        </p>
      </div>

      {isLong ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((previous) => !previous)}
          className="self-start"
        >
          {isExpanded ? t("showLess") : t("showMore")}
        </Button>
      ) : null}
    </Card>
  )
}
