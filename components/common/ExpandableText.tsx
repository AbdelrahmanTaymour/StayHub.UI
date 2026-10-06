"use client"

import { useTranslations } from "next-intl"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

const DEFAULT_THRESHOLD = 320

interface ExpandableTextProps {
  text: string
  /** Character count above which the text collapses. */
  threshold?: number
  className?: string
  textClassName?: string
}

export function ExpandableText({
  text,
  threshold = DEFAULT_THRESHOLD,
  className,
  textClassName,
}: ExpandableTextProps) {
  const t = useTranslations("common.readMore")
  const contentId = useId()
  const [isExpanded, setIsExpanded] = useState(false)

  const isLong = text.length > threshold
  const isCollapsed = isLong && !isExpanded

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p
        id={contentId}
        className={cn(
          "leading-relaxed whitespace-pre-line text-foreground",
          isCollapsed && "line-clamp-4",
          textClassName
        )}
      >
        {text}
      </p>

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
          {isExpanded ? t("less") : t("more")}
        </Button>
      ) : null}
    </div>
  )
}
