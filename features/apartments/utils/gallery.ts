import type { ApartmentImage } from "@/features/apartments/types/apartment-details"

export const MAX_VISIBLE_GALLERY_IMAGES = 5
export const GALLERY_SIZES = "(min-width: 1024px) 60vw, 100vw"

export interface GalleryImage {
  id: string
  url: string
}

function compareImages(a: ApartmentImage, b: ApartmentImage) {
  const primaryDiff =
    Number(b.isPrimary ?? false) - Number(a.isPrimary ?? false)
  return primaryDiff || (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
}

/** Primary image first, then display order. Drops images without an id or url. */
export function getGalleryImages(
  images: ApartmentImage[] | null | undefined
): GalleryImage[] {
  return [...(images ?? [])]
    .sort(compareImages)
    .flatMap((image): GalleryImage[] =>
      image.id && image.url ? [{ id: image.id, url: image.url }] : []
    )
}

/**
 * Grid height and columns for the number of visible tiles (1 to 5).
 * Mobile uses a single column for 1 image and two columns for more.
 */
export function getGalleryGridClassName(visibleCount: number): string {
  if (visibleCount === 1) return "h-72 grid-cols-1 md:h-120"
  if (visibleCount === 2) return "h-72 grid-cols-2 md:h-120"
  if (visibleCount === 3) return "h-72 grid-cols-2 grid-rows-2 md:h-120"
  return "h-96 grid-cols-2 grid-rows-3 md:h-120 md:grid-cols-4 md:grid-rows-2"
}

/** Spans that keep the grid full with no empty cells. */
export function getGalleryTileClassName(
  index: number,
  visibleCount: number
): string {
  if (visibleCount === 3 && index === 0) return "row-span-2"
  if (visibleCount >= 4 && index === 0)
    return "col-span-2 md:col-span-2 md:row-span-2"
  if (visibleCount === 4 && index === 3) return "col-span-2"
  return ""
}
