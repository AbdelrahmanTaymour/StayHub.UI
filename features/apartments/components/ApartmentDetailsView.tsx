import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"

import { PageHeader } from "@/components/common/PageHeader"
import { RatingSummary } from "@/components/common/RatingSummary"
import { Card } from "@/components/ui/card"
import type { ApartmentDetails } from "@/features/apartments/types/apartment-details"
import { getGalleryImages } from "@/features/apartments/utils/gallery"
import { ApartmentAmenities } from "./ApartmentAmenities"
import { ApartmentBookingCard } from "./ApartmentBookingCard"
import { ApartmentDescription } from "./ApartmentDescription"
import { ApartmentGallery } from "./ApartmentGallery"
import { ApartmentHostCard } from "./ApartmentHostCard"
import { ApartmentLocation } from "./ApartmentLocation"
import { ApartmentReviews } from "./ApartmentReviews"
import { SaveApartmentButton } from "./SaveApartmentButton"
import { ShareButton } from "../../../components/common/ShareButton"
import { formatCityCountry } from "@/lib/utils/formatAddress"

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
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
              isFavorited={apartment.isFavorited}
            />
            <ShareButton />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
          <Card className="gap-0 overflow-hidden p-0">
            <ApartmentGallery images={images} title={title} />
            <ApartmentHostCard host={apartment.host} />
          </Card>

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
