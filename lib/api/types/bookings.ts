import type { components, operations, paths } from "../generated/api"

export type Schemas = components["schemas"]
export type Operations = operations
export type ApiPaths = paths

export type BookingStatus = Schemas["StayHub.Domain.Bookings.BookingStatus"]

export type BookingResponse =
  Schemas["StayHub.Application.Bookings.GetBooking.BookingResponse"]

export type BookingHostResponse =
  Schemas["StayHub.Application.Bookings.GetBooking.BookingHostResponse"]

export type ReserveBookingRequest =
  Schemas["StayHub.Api.Endpoints.Bookings.ReserveBookingRequest"]

export type MyBookingsResponse =
  Schemas["StayHub.Application.Bookings.GetMyBookings.MyBookingsResponse"]

export type MyBookingsFilter =
  Schemas["StayHub.Application.Bookings.GetMyBookings.MyBookingsFilter"]

export type BookingSummaryResponse =
  Schemas["StayHub.Application.Bookings.GetBookingsByUser.BookingSummaryResponse"]

export type ApartmentBookingResponse =
  Schemas["StayHub.Application.Bookings.GetApartmentBookings.ApartmentBookingResponse"]

export type ApartmentBookingsFilter =
  Schemas["StayHub.Application.Bookings.GetApartmentBookings.ApartmentBookingsFilter"]

export type ApartmentBookingsSort =
  Schemas["StayHub.Application.Bookings.GetApartmentBookings.ApartmentBookingsSort"]

export type ConversationBookingDetailsResponse =
  Schemas["StayHub.Application.Bookings.GetConversationBookingDetails.ConversationBookingDetailsResponse"]
