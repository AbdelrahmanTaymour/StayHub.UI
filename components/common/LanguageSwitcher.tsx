"use client"

import { Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

export function LanguageSwitcher() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const nextLocale =
    routing.locales.find((candidate) => candidate !== locale) ?? locale
  const nextLocaleLabel = new Intl.DisplayNames([locale], {
    type: "language",
  }).of(nextLocale)

  function handleClick() {
    // Preserve whatever filters/pagination are in the URL — switching
    // language shouldn't reset a search in progress.
    const query = Object.fromEntries(searchParams.entries())
    router.replace({ pathname, query }, { locale: nextLocale })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={handleClick}
      aria-label={
        nextLocaleLabel
          ? t("switchLanguage", { language: nextLocaleLabel })
          : undefined
      }
    >
      <Languages className="size-4" aria-hidden="true" />
      {locale.toUpperCase()}
    </Button>
  )
}
