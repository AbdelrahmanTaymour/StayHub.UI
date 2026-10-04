"use client"

import { Moon, Sun } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const t = useTranslations("nav")
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="relative"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Sun Icon + Accessible label for Dark Mode */}
      <span className="hidden items-center gap-2 dark:inline-flex">
        <Sun className="size-4" aria-hidden="true" />
        <span className="sr-only">{t("switchToLight")}</span>
      </span>

      {/* Moon Icon + Accessible label for Light Mode */}
      <span className="inline-flex items-center gap-2 dark:hidden">
        <Moon className="size-4" aria-hidden="true" />
        <span className="sr-only">{t("switchToDark")}</span>
      </span>
    </Button>
  )
}
