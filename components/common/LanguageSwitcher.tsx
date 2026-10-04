"use client"

import { Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { cn } from "cn"

const localeLabels: Record<string, string> = {
  en: "English",
  ar: "العربية",
}

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

  function handleClick(nextLocale: string) {
    // Preserve whatever filters/pagination are in the URL — switching
    // language shouldn't reset a search in progress.
    const query = Object.fromEntries(searchParams.entries())
    router.replace({ pathname, query }, { locale: nextLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            type="button"
            aria-label={
              nextLocaleLabel
                ? t("switchLanguage", { language: nextLocaleLabel })
                : undefined
            }
          />
        }
      >
        <Languages className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleClick(loc)}
            className={cn(loc === locale && "font-medium text-primary")}
          >
            {localeLabels[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
