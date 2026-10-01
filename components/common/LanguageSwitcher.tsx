"use client"

import { useLocale } from "next-intl"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { routing } from "@/i18n/routing"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const nextLocale = routing.locales.find((l) => l !== locale) ?? locale

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
    >
      <Globe className="size-4" />
      {locale.toUpperCase()}
    </Button>
  )
}
