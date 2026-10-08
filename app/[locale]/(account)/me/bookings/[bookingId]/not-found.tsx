import { getTranslations } from "next-intl/server"

export default async function BookingNotFound() {
  const t = await getTranslations("bookings.detail")

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <p className="text-lg font-semibold text-foreground">
        {t("notFoundTitle")}
      </p>
      <p className="text-sm text-foreground">{t("notFoundDescription")}</p>
    </div>
  )
}
