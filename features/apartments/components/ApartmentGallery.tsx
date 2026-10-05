import { ImageOff } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { EmptyState } from "@/components/feedback/EmptyState"
import { cn } from "cn"
import {
  GALLERY_SIZES,
  MAX_VISIBLE_GALLERY_IMAGES,
  getGalleryGridClassName,
  getGalleryTileClassName,
  type GalleryImage,
} from "@/features/apartments/utils/gallery"

interface ApartmentGalleryProps {
  images: GalleryImage[]
  title: string
}

export function ApartmentGallery({ images, title }: ApartmentGalleryProps) {
  const t = useTranslations("apartmentDetails.gallery")

  if (images.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="size-10" />}
        title={t("empty")}
        description={t("emptyDescription")}
      />
    )
  }

  const visibleImages = images.slice(0, MAX_VISIBLE_GALLERY_IMAGES)
  const hiddenCount = images.length - visibleImages.length
  const visibleCount = visibleImages.length

  return (
    <section
      aria-label={t("label")}
      className={cn(
        "grid gap-2 overflow-hidden rounded-2xl",
        getGalleryGridClassName(visibleCount)
      )}
    >
      {visibleImages.map((image, index) => {
        const showOverlay = hiddenCount > 0 && index === visibleCount - 1

        return (
          <div
            key={image.id}
            className={cn(
              "relative overflow-hidden rounded-xl bg-muted",
              getGalleryTileClassName(index, visibleCount)
            )}
          >
            <Image
              src={image.url}
              alt={t("photoAlt", { title, index: index + 1 })}
              fill
              priority={index === 0}
              sizes={GALLERY_SIZES}
              className="object-cover"
            />

            {showOverlay ? (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                <span
                  aria-hidden="true"
                  className="text-2xl font-semibold text-background"
                >
                  {t("morePhotos", { count: hiddenCount })}
                </span>
                <span className="sr-only">
                  {t("morePhotosLabel", { count: hiddenCount })}
                </span>
              </div>
            ) : null}
          </div>
        )
      })}
    </section>
  )
}
