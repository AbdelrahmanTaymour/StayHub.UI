import { useTranslations } from "next-intl"

interface ApartmentDescriptionProps {
  description?: string | null
}

export function ApartmentDescription({
  description,
}: ApartmentDescriptionProps) {
  const t = useTranslations("apartmentDetails.description")

  if (!description) return null

  return (
    <section
      aria-labelledby="apartment-description-heading"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <h2
        id="apartment-description-heading"
        className="text-xl font-semibold text-foreground"
      >
        {t("title")}
      </h2>
      <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
        {description}
      </p>
    </section>
  )
}
