"use client"

import { useId } from "react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { ExpandableText } from "@/components/common/ExpandableText"

interface ApartmentDescriptionProps {
  description?: string | null
}

export function ApartmentDescription({
  description,
}: ApartmentDescriptionProps) {
  const t = useTranslations("apartmentDetails.description")
  const headingId = useId()

  if (!description) return null

  return (
    <Card as="section" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-lg font-semibold text-foreground">
        {t("title")}
      </h2>

      <ExpandableText text={description} />
    </Card>
  )
}
