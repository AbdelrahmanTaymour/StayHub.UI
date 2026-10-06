import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { ApartmentResults } from "@/features/apartments/components/ApartmentResults"
import { ScrollToResultsButton } from "@/features/apartments/components/ScrollToResultsButton"
import { HeroSearchBar } from "@/features/apartments/components/HeroSearchBar"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home")

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function HomePage() {
  const t = await getTranslations("home")

  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[calc(100dvh-4rem)] w-full flex-col justify-between overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-primary/20 via-background/80 to-background"
        />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-10 px-6 py-12 text-center">
          <div className="flex w-full max-w-3xl flex-col items-center gap-4">
            <h1
              id="hero-title"
              className="flex flex-col gap-2 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl"
            >
              <span>{t("heroLineOne")}</span>
              <span className="bg-linear-to-r from-primary via-primary/80 to-foreground bg-clip-text pb-1 text-transparent">
                {t("heroLineTwo")}
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-pretty text-foreground sm:text-lg">
              {t("heroSubtitle")}
            </p>
          </div>

          <div className="w-full max-w-6xl">
            <HeroSearchBar />
          </div>
        </div>

        <div className="flex justify-center pb-6">
          <ScrollToResultsButton
            targetId="curated-stays"
            label={t("scrollToExplore")}
          />
        </div>
      </section>

      <section
        id="curated-stays"
        tabIndex={-1}
        aria-labelledby="results-heading"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-6 py-12 focus:outline-none"
      >
        <ApartmentResults />
      </section>
    </>
  )
}
