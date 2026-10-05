import type { getApartmentPricing } from "@/features/apartments/api/apartments"
import { getApartmentDetailsServer } from "../api/apartments.server"

export type ApartmentDetails = NonNullable<
  Awaited<ReturnType<typeof getApartmentDetailsServer>>
>
export type ApartmentImage = NonNullable<ApartmentDetails["images"]>[number]
export type ApartmentReview = NonNullable<
  ApartmentDetails["recentReviews"]
>[number]
export type ApartmentAddress = ApartmentDetails["address"]
export type ApartmentPricing = Awaited<ReturnType<typeof getApartmentPricing>>
