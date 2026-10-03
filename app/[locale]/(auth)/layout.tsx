import { Building2 } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

import { Link } from "@/i18n/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations("common")

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="size-4" aria-hidden="true" />
            </div>
            {t("appName")}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="/cover.jpg"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />

        <div className="hero-overlay absolute inset-0" aria-hidden="true" />
      </div>
    </div>
  )
}
