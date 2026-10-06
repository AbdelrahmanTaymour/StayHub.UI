import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"

interface ApartmentMapProps {
  address: string
}

/**
 * @todo: Replace the inner content with the map provider when it's
 * chosen. Keep the wrapper and height so the layout doesn't shift.
 */
export function ApartmentMap({ address }: ApartmentMapProps) {
  const t = useTranslations("apartmentDetails.location")

  return (
    <div
      role="img"
      aria-label={t("mapLabel", { address })}
      className="flex h-72 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted text-sm text-foreground"
    >
      <MapPin aria-hidden="true" className="size-6" />
      <span>{t("mapPlaceholder")}</span>
    </div>
  )
}
