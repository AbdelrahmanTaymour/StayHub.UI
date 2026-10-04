import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type ApartmentResponse =
  Schemas["StayHub.Application.Apartments.GetApartment.ApartmentResponse"]

export type AddressResponse =
  Schemas["StayHub.Application.Apartments.GetApartment.AddressResponse"]

export type ApartmentHostResponse =
  Schemas["StayHub.Application.Apartments.GetApartment.ApartmentHostResponse"]

export type ApartmentImageResponse =
  Schemas["StayHub.Application.Apartments.GetApartment.ApartmentImageResponse"]

export type ApartmentReviewPreviewResponse =
  Schemas["StayHub.Application.Apartments.GetApartment.ApartmentReviewPreviewResponse"]

export type ApartmentForEditResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentForEdit.ApartmentForEditResponse"]

export type ApartmentAddressResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentForEdit.ApartmentAddressResponse"]

export type ApartmentPricingResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentPricing.ApartmentPricingResponse"]

export type MyApartmentsResponse =
  Schemas["StayHub.Application.Apartments.GetMyApartments.MyApartmentsResponse"]

export type MyApartmentsFilter =
  Schemas["StayHub.Application.Apartments.GetMyApartments.MyApartmentsFilter"]

export type MyApartmentsDashboardResponse =
  Schemas["StayHub.Application.Apartments.GetMyApartmentsDashboard.MyApartmentsDashboardResponse"]

export type RevenueByCurrencyResponse =
  Schemas["StayHub.Application.Apartments.GetMyApartmentsDashboard.RevenueByCurrencyResponse"]

export type CreateApartmentRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.CreateApartmentRequest"]

export type UpdateApartmentRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.UpdateApartmentRequest"]

export type SearchApartmentsResponse =
  Schemas["StayHub.Application.Apartments.SearchApartments.SearchApartmentsResponse"]

export type OwnerApartmentsResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentsByOwner.OwnerApartmentsResponse"]

export type OwnerApartmentsSort =
  Schemas["StayHub.Application.Apartments.GetApartmentsByOwner.OwnerApartmentsSort"]

// APARTMENT AMENITIES & IMAGES
export type Amenity = Schemas["StayHub.Domain.Apartments.Amenity"]

export type ApartmentAmenitiesResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentAmenities.ApartmentAmenitiesResponse"]

export type AddApartmentAmenityRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.AddApartmentAmenityRequest"]

export type ApartmentImagesResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentImages.ApartmentImagesResponse"]

export type ApartmentImagesListItemResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentImages.ApartmentImageResponse"]

export type AddApartmentImageRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.AddApartmentImageRequest"]

export type ReorderApartmentImagesRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.ReorderApartmentImagesRequest"]

// APARTMENT AVAILABILITY
export type ApartmentAvailabilityResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentAvailabilityBlocks.ApartmentAvailabilityResponse"]

export type AvailabilityBlockResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentAvailabilityBlocks.AvailabilityBlockResponse"]

export type BookedRangeResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentAvailabilityBlocks.BookedRangeResponse"]

export type CreateApartmentAvailabilityBlockRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.CreateApartmentAvailabilityBlockRequest"]

export type ApartmentUnavailabilityReason =
  Schemas["StayHub.Domain.Apartments.ApartmentUnavailabilityReason"]

// APARTMENT STAFF
export type ApartmentStaffRole =
  Schemas["StayHub.Domain.Apartments.ApartmentStaffRole"]

export type ApartmentStaffResponse =
  Schemas["StayHub.Application.Apartments.GetApartmentStaff.ApartmentStaffResponse"]

export type AssignApartmentStaffRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.AssignApartmentStaffRequest"]

export type InviteStaffRequest =
  Schemas["StayHub.Api.Endpoints.Apartments.InviteStaffRequest"]

export type StaffCandidateResponse =
  Schemas["StayHub.Application.Apartments.SearchStaffCandidate.StaffCandidateResponse"]
