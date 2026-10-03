import { Geist_Mono, Inter, Cairo } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { notFound } from "next/navigation"

import "../globals.css"
import { routing } from "@/i18n/routing"
import { AppProviders } from "@/providers/AppProviders"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/auth/auth"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const session = await auth()

  const dir = locale === "ar" ? "rtl" : "ltr"
  const isArabic = locale === "ar"

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        inter.variable,
        cairo.variable,
        fontMono.variable,
        isArabic ? cairo.className : inter.className
      )}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders session={session}>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </AppProviders>
      </body>
    </html>
  )
}
