import { MapPin, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import { RatingSummary } from "@/components/common/RatingSummary"
import type { ApartmentDetails } from "@/features/apartments/types/apartment-details"
import { formatCityCountry } from "@/features/apartments/utils/format-address"
import { getGalleryImages } from "@/features/apartments/utils/gallery"
import { SaveApartmentButton } from "./SaveApartmentButton"
import { ApartmentGallery } from "./ApartmentGallery"
import { ApartmentHostCard } from "./ApartmentHostCard"
import { ApartmentDescription } from "./ApartmentDescription"
import { ApartmentAmenities } from "./ApartmentAmenities"
import { ApartmentReviews } from "./ApartmentReviews"
import { ApartmentLocation } from "./ApartmentLocation"
import { ApartmentBookingCard } from "./ApartmentBookingCard"

interface ApartmentDetailsViewProps {
  apartmentId: string
  apartment: ApartmentDetails
}

export function ApartmentDetailsView({
  apartmentId,
  apartment,
}: ApartmentDetailsViewProps) {
  const t = useTranslations("apartmentDetails")

  const title = apartment.name ?? t("untitled")
  const location = formatCityCountry(apartment.address)
  const images = getGalleryImages(apartment.images)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 md:py-8">
      <PageHeader
        title={title}
        meta={
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <RatingSummary
              rating={apartment.rating}
              reviewCount={apartment.reviewCount}
            />
            {location ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin aria-hidden="true" className="size-4" />
                  {location}
                </span>
              </>
            ) : null}
          </div>
        }
        actions={
          <>
            <SaveApartmentButton
              apartmentId={apartmentId}
              initialIsFavorited={apartment.isFavorited ?? false}
            />
            <Button
              type="button"
              variant="outline"
              disabled
              title={t("actions.comingSoon")}
              className="gap-2"
            >
              <Share2 aria-hidden="true" className="size-4" />
              {t("actions.share")}
            </Button>
          </>
        }
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
          <ApartmentGallery images={images} title={title} />
          <ApartmentHostCard host={apartment.host} />
          <ApartmentDescription description={apartment.description} />
          <ApartmentAmenities amenities={apartment.amenities} />
          <ApartmentReviews
            rating={apartment.rating}
            reviewCount={apartment.reviewCount}
            reviews={apartment.recentReviews ?? []}
          />
          <ApartmentLocation address={apartment.address} />
        </div>

        <aside aria-label={t("bookingAside")} className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <ApartmentBookingCard
              apartmentId={apartmentId}
              pricePerNight={apartment.priceAmount}
              currency={apartment.priceCurrency}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
