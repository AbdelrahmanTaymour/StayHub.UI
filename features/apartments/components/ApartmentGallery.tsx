"use client"

import { ImageOff } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { EmptyState } from "@/components/feedback/EmptyState"
import { cn } from "cn"
import {
  GALLERY_SIZES,
  MAX_VISIBLE_GALLERY_IMAGES,
  getGalleryGridClassName,
  getGalleryTileClassName,
  type GalleryImage,
} from "@/features/apartments/utils/gallery"

// Loaded on first open only, which keeps it out of the initial mobile bundle.
const ApartmentImagePreview = dynamic(
  () =>
    import("./ApartmentImagePreview").then((mod) => mod.ApartmentImagePreview),
  { ssr: false }
)

interface ApartmentGalleryProps {
  images: GalleryImage[]
  title: string
}

export function ApartmentGallery({ images, title }: ApartmentGalleryProps) {
  const t = useTranslations("apartmentDetails.gallery")
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  if (images.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="size-10" />}
        title={t("empty")}
        description={t("emptyDescription")}
        className="rounded-none border-0"
      />
    )
  }

  const visibleImages = images.slice(0, MAX_VISIBLE_GALLERY_IMAGES)
  const visibleCount = visibleImages.length
  const hiddenCount = images.length - visibleCount

  return (
    <>
      <section
        aria-label={t("label")}
        className={cn("grid gap-2", getGalleryGridClassName(visibleCount))}
      >
        {visibleImages.map((image, index) => {
          const isOverlayTile = hiddenCount > 0 && index === visibleCount - 1
          const label = isOverlayTile
            ? t("morePhotosLabel", { count: hiddenCount })
            : t("openPhoto", { title, index: index + 1 })

          return (
            <button
              key={image.id}
              type="button"
              aria-label={label}
              onClick={() => setPreviewIndex(index)}
              className={cn(
                "group relative overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
                getGalleryTileClassName(index, visibleCount)
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                priority={index === 0}
                sizes={GALLERY_SIZES}
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />

              {isOverlayTile ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-foreground/60 text-2xl font-semibold text-background"
                >
                  {t("morePhotos", { count: hiddenCount })}
                </span>
              ) : null}
            </button>
          )
        })}
      </section>

      {previewIndex !== null ? (
        <ApartmentImagePreview
          images={images}
          initialIndex={previewIndex}
          title={title}
          onClose={() => setPreviewIndex(null)}
        />
      ) : null}
    </>
  )
}
