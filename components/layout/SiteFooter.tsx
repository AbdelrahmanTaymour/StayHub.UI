import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

export function SiteFooter() {
  const t = useTranslations("footer")

  return (
    <footer className="mt-auto w-full border-t border-border bg-card py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            {t("rights", { year: new Date().getFullYear() })}
          </p>
          <nav
            aria-label={t("legalNavLabel")}
            className="flex items-center gap-6"
          >
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("privacy")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
