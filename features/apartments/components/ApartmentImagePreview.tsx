"use client"

import { ChevronLeft, ChevronRight, Loader2, ImageOff } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type { GalleryImage } from "@/features/apartments/utils/gallery"
import { cn } from "cn"

/** Dialog content width on sm and up: max-w-4xl (896px) minus p-6 on both sides. */
const PREVIEW_SIZES = "(min-width: 640px) 848px, 100vw"

interface ApartmentImagePreviewProps {
  images: GalleryImage[]
  initialIndex: number
  title: string
  onClose: () => void
}

type LoadState = { url: string; status: "loaded" | "error" }

export function ApartmentImagePreview({
  images,
  initialIndex,
  title,
  onClose,
}: ApartmentImagePreviewProps) {
  const t = useTranslations("apartmentDetails.gallery.preview")
  const [index, setIndex] = useState(initialIndex)
  const [loadState, setLoadState] = useState<LoadState | null>(null)

  const total = images.length
  const current = images[index]
  const hasMultiple = total > 1

  const goTo = useCallback(
    (next: number) => setIndex((next + total) % total),
    [total]
  )

  useEffect(() => {
    if (!hasMultiple) return

    function handleKeyDown(event: KeyboardEvent) {
      const isRtl = document.documentElement.dir === "rtl"
      const forwardKey = isRtl ? "ArrowLeft" : "ArrowRight"
      const backwardKey = isRtl ? "ArrowRight" : "ArrowLeft"

      if (event.key === forwardKey) goTo(index + 1)
      if (event.key === backwardKey) goTo(index - 1)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [hasMultiple, goTo, index])

  // Warm the browser cache for the neighbors so the next click feels instant.
  useEffect(() => {
    for (const offset of [1, -1]) {
      const neighbor = images[(index + offset + total) % total]
      if (neighbor && hasMultiple) {
        const preloader = new window.Image()
        preloader.src = neighbor.url
      }
    }
  }, [images, index, total, hasMultiple])

  if (!current) return null

  const isCurrentSettled = loadState?.url === current.url
  const isLoading = !isCurrentSettled
  const hasError = isCurrentSettled && loadState.status === "error"

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-dvh max-h-dvh w-full max-w-none flex-col gap-3 rounded-none border-0 p-0 sm:h-auto sm:max-w-4xl sm:rounded-2xl sm:p-6">
        <DialogTitle className="sr-only">{t("title", { title })}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-muted sm:aspect-video sm:flex-none">
          {isLoading ? (
            <div
              role="status"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-muted"
            >
              <Loader2
                aria-hidden="true"
                className="size-8 animate-spin text-foreground"
              />
              <span className="text-sm text-foreground">{t("loading")}</span>
            </div>
          ) : null}

          {hasError ? (
            <div
              role="alert"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-muted"
            >
              <ImageOff aria-hidden="true" className="size-8 text-foreground" />
              <span className="text-sm text-foreground">{t("loadError")}</span>
            </div>
          ) : null}

          <Image
            key={current.url}
            src={current.url}
            alt={t("imageAlt", { title, index: index + 1 })}
            fill
            sizes={PREVIEW_SIZES}
            className={cn(
              "object-contain transition-opacity duration-300 motion-reduce:transition-none",
              isLoading && "opacity-0"
            )}
            onLoad={() => setLoadState({ url: current.url, status: "loaded" })}
            onError={() => setLoadState({ url: current.url, status: "error" })}
          />

          {hasMultiple ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={t("previous")}
                onClick={() => goTo(index - 1)}
                className="absolute inset-s-3 top-1/2 z-20 -translate-y-1/2"
              >
                <ChevronLeft
                  aria-hidden="true"
                  className="size-5 rtl:rotate-180"
                />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={t("next")}
                onClick={() => goTo(index + 1)}
                className="absolute inset-e-3 top-1/2 z-20 -translate-y-1/2"
              >
                <ChevronRight
                  aria-hidden="true"
                  className="size-5 rtl:rotate-180"
                />
              </Button>
            </>
          ) : null}
        </div>

        <p
          aria-live="polite"
          className="text-center text-sm text-foreground tabular-nums"
        >
          {t("counter", { current: index + 1, total })}
        </p>
      </DialogContent>
    </Dialog>
  )
}
