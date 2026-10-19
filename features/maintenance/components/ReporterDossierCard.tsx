import { Mail, Phone, ShieldUser, User } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

interface ReporterDossierCardProps {
  name: string
  email?: string | null
  phoneNumber?: string | null
  reporterUserId?: string
}

export function ReporterDossierCard({
  name,
  email,
  phoneNumber,
  reporterUserId,
}: ReporterDossierCardProps) {
  const t = useTranslations("apartmentManage.maintenanceDetail.reporter")

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <span className="absolute inset-e-0 top-0 flex items-center gap-1 rounded-bl-lg bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <ShieldUser aria-hidden="true" className="size-3.5" />
        {t("confidential")}
      </span>

      <h3 className="mb-3 font-semibold text-foreground">{t("title")}</h3>

      <div className="flex flex-col gap-4">
        <DossierRow icon={<User className="size-4" />} label={t("name")}>
          {reporterUserId ? (
            <Link
              href={`/owners/${reporterUserId}`}
              className="hover:text-tertiary hover:underline"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </DossierRow>

        {phoneNumber ? (
          <DossierRow icon={<Phone className="size-4" />} label={t("phone")}>
            <a
              href={`tel:${phoneNumber}`}
              className="font-mono text-tertiary hover:underline"
            >
              {phoneNumber}
            </a>
          </DossierRow>
        ) : null}

        {email ? (
          <DossierRow icon={<Mail className="size-4" />} label={t("email")}>
            <a
              href={`mailto:${email}`}
              className="block max-w-50 truncate font-mono hover:text-tertiary"
            >
              {email}
            </a>
          </DossierRow>
        ) : null}
      </div>
    </div>
  )
}

function DossierRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-tertiary"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-foreground/70">{label}</p>
        <p className="truncate font-medium text-foreground">{children}</p>
      </div>
    </div>
  )
}
