import { getTranslations } from "next-intl/server"

import { ApartmentResults } from "@/features/apartments/components/ApartmentResults"
import { HeroSearchBar } from "@/features/apartments/components/HeroSearchBar"

export async function generateMetadata() {
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
        className="relative isolate flex min-h-dvh w-full flex-col justify-between overflow-hidden"
      >
        {/* Hero background */}
        <div
          className="absolute inset-0 z-0 bg-linear-to-b from-primary/20 via-background/80 to-background"
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pt-16 text-center sm:px-6 lg:px-8">
          <div className="flex w-full max-w-5xl flex-col items-center gap-4">
            <h1
              id="hero-title"
              className="flex flex-col gap-2 text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
            >
              <span>{t("heroLineOne")}</span>

              <span className="inline-block bg-linear-to-r from-primary via-primary/80 to-foreground bg-clip-text pb-1 text-transparent">
                {t("heroLineTwo")}
              </span>
            </h1>

            {/* 
            <h1
              id="hero-title"
              className="flex flex-col gap-2 text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
            >
              <span>Find your next favorite place</span>
              <span className="inline-block bg-linear-to-r from-primary via-primary/80 to-foreground bg-clip-text pb-1 text-transparent">
                ready whenever you are
              </span>
            </h1>
            */}

            <p className="sm:text-md max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
              {t("heroSubtitle")}
            </p>
          </div>

          <div className="mt-8 w-full max-w-7xl px-2 sm:px-4">
            <HeroSearchBar />
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#curated-stays"
          className="group relative z-10 flex w-full flex-col items-center gap-1.5 pb-8 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span>{t("scrollToExplore")}</span>

          <span
            aria-hidden="true"
            className="text-lg transition-transform group-hover:translate-y-0.5"
          >
            ↓
          </span>
        </a>
      </section>

      <section
        id="curated-stays"
        aria-labelledby="results-heading"
        className="mx-auto w-full max-w-7xl px-6 py-12"
      >
        <ApartmentResults />
      </section>
    </>
  )
}
