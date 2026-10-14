"use client"

import { Minus, Plus, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRef, useState, type WheelEvent } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5

interface ApartmentImagePreviewDialogProps {
  url: string | null
  alt: string
  onClose: () => void
}

export function ApartmentImagePreviewDialog({
  url,
  alt,
  onClose,
}: ApartmentImagePreviewDialogProps) {
  const t = useTranslations("apartmentManage.images.preview")
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  function clampZoom(value: number) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    setZoom((z) => clampZoom(z + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)))
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setZoom(1)
      onClose()
    }
  }

  return (
    <Dialog open={url !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="h-dvh max-h-dvh w-full max-w-none gap-0 rounded-none border-0 p-0 sm:h-[85vh] sm:max-w-4xl sm:rounded-2xl">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>

        <div
          ref={containerRef}
          onWheel={handleWheel}
          className="relative h-full w-full touch-none overflow-hidden bg-foreground/5"
        >
          {url ? (
            <div
              className="flex h-full w-full items-center justify-center transition-transform duration-150 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <Image
                src={url}
                alt={alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
          ) : null}

          <div className="absolute inset-s-1/2 bottom-4 flex -translate-x-1/2 items-center gap-1 rounded-full bg-card/95 p-1.5 shadow-lg backdrop-blur">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("zoomOut")}
              disabled={zoom <= MIN_ZOOM}
              onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
            >
              <Minus aria-hidden="true" className="size-4" />
            </Button>
            <span className="min-w-12 text-center text-xs font-medium text-foreground tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("zoomIn")}
              disabled={zoom >= MAX_ZOOM}
              onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
            >
              <Plus aria-hidden="true" className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("resetZoom")}
              disabled={zoom === 1}
              onClick={() => setZoom(1)}
            >
              <RotateCcw aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
