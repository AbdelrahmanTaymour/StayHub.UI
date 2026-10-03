import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import { QueryParameters } from "@/lib/api/type-utils"
import { ReserveBookingRequest } from "@/lib/api/types/bookings"

type MyBookingsQuery = QueryParameters<"/api/v1/bookings/mine", "get">
type ByUserQuery = QueryParameters<"/api/v1/bookings/by-user/{userId}", "get">
type ApartmentBookingsQuery = QueryParameters<
  "/api/v1/bookings/{apartmentId}/bookings",
  "get"
>

export async function reserveBooking(body: ReserveBookingRequest) {
  const { data, error } = await apiClient.POST("/api/v1/bookings", { body })
  if (error) throw error
  return data
}

export async function getBooking(id: string) {
  const { data, error } = await apiClient.GET("/api/v1/bookings/{id}", {
    params: { path: { id } },
  })
  if (error) throw error
  return data
}

export async function getMyBookings(query?: MyBookingsQuery) {
  const { data, error } = await apiClient.GET("/api/v1/bookings/mine", {
    params: { query },
  })
  if (error) throw error
  return data
}

export async function getBookingsByUser(userId: string, query?: ByUserQuery) {
  const { data, error } = await apiClient.GET(
    "/api/v1/bookings/by-user/{userId}",
    { params: { path: { userId }, query } }
  )
  if (error) throw error
  return data
}

export async function getApartmentBookings(
  apartmentId: string,
  query?: ApartmentBookingsQuery
) {
  const { data, error } = await apiClient.GET(
    "/api/v1/bookings/{apartmentId}/bookings",
    { params: { path: { apartmentId }, query } }
  )
  if (error) throw error
  return data
}

export async function getConversationBookingDetails(conversationId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/bookings/by-conversation/{conversationId}",
    { params: { path: { conversationId } } }
  )
  if (error) throw error
  return data
}

export async function confirmBooking(id: string) {
  const { error } = await apiClient.POST("/api/v1/bookings/{id}/confirm", {
    params: { path: { id } },
  })
  if (error) throw error
}

export async function rejectBooking(id: string) {
  const { error } = await apiClient.POST("/api/v1/bookings/{id}/reject", {
    params: { path: { id } },
  })
  if (error) throw error
}

export async function cancelBooking(id: string) {
  const { error } = await apiClient.POST("/api/v1/bookings/{id}/cancel", {
    params: { path: { id } },
  })
  if (error) throw error
}

/*
type ReserveBookingRequest = {
    apartmentId?: string; // uuid
    startDate?: string; // date
    endDate?: string; // date
}

type MyBookingsQuery = {
    filter?: MyBookingsFilter; // narrows the caller's own bookings by status/timing
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}
type MyBookingsFilter = "All" | "Upcoming" | "Completed" | "Cancelled"
// All: every booking the caller has made
// Upcoming: bookings with a future/ongoing stay
// Completed: bookings whose stay has already ended
// Cancelled: bookings the caller or host cancelled

type ByUserQuery = {
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}

type ApartmentBookingsQuery = {
    filter?: ApartmentBookingsFilter; // narrows bookings for this apartment by status
    sort?: ApartmentBookingsSort; // sort order applied to the result list
    page?: number; // 1-based page number
    pageSize?: number; // items per page
}
type ApartmentBookingsFilter = "All" | "Pending" | "Confirmed" | "Cancelled" | "Rejected"
// All: every booking for the apartment
// Pending: awaiting host confirmation
// Confirmed: accepted by the host
// Cancelled: cancelled by guest or host
// Rejected: declined by the host

type ApartmentBookingsSort = "CheckInAsc" | "CheckInDesc" | "TotalDesc" | "TotalAsc"
// CheckInAsc/CheckInDesc: order by check-in date, earliest/latest first
// TotalDesc/TotalAsc: order by total price, highest/lowest first

type BookingStatus = "Reserved" | "Confirmed" | "Rejected" | "Cancelled" | "Completed"
// Reserved: created, awaiting host confirmation
// Confirmed: accepted by the host
// Rejected: declined by the host
// Cancelled: cancelled by guest or host after being reserved/confirmed
// Completed: stay period has fully passed

// Responses

type ReserveBookingResponse = string // new booking id (uuid)

type GetBookingResponse = BookingResponse
type BookingResponse = {
    id?: string; // uuid
    status?: BookingStatus;
    canCancel?: boolean;
    createdOnUtc?: string; // date-time
    updatedOnUtc?: string; // date-time
    apartmentId?: string; // uuid
    apartmentName?: string | null;
    apartmentImageUrl?: string | null;
    address?: AddressResponse;
    durationStart?: string; // date
    durationEnd?: string; // date
    nights?: number; // int32
    currency?: string | null;
    pricePerNight?: number; // double
    priceForPeriodAmount?: number; // double
    cleaningFeeAmount?: number; // double
    amenitiesUpChargeAmount?: number; // double
    totalPriceAmount?: number; // double
    host?: BookingHostResponse;
    conversationId?: string | null; // uuid
}
type AddressResponse = {
    country?: string | null;
    state?: string | null;
    zipCode?: string | null;
    city?: string | null;
    street?: string | null;
}
type BookingHostResponse = {
    id?: string; // uuid
    fullName?: string | null;
    avatarUrl?: string | null;
}

type GetMyBookingsResponse = PagedResponse<MyBookingsResponse>
type MyBookingsResponse = {
    id?: string; // uuid
    apartmentId?: string; // uuid
    apartmentName?: string | null;
    apartmentCity?: string | null;
    primaryImageUrl?: string | null;
    status?: BookingStatus;
    pricePerNight?: number; // double
    totalPriceAmount?: number; // double
    totalPriceCurrency?: string | null;
    durationStart?: string; // date
    durationEnd?: string; // date
    nights?: number; // int32
    canCancel?: boolean;
}
type PagedResponse<T> = {
    items: T[] | null;
    page?: number; // int32
    pageSize?: number; // int32
    totalCount?: number; // int32
    totalPages?: number; // int32
}

type GetBookingsByUserResponse = BookingSummaryResponse[]
type BookingSummaryResponse = {
    id?: string; // uuid
    apartmentId?: string; // uuid
    status?: BookingStatus;
    totalPriceAmount?: number; // double
    totalPriceCurrency?: string | null;
    durationStart?: string; // date
    durationEnd?: string; // date
}

type GetApartmentBookingsResponse = PagedResponse<ApartmentBookingResponse>
type ApartmentBookingResponse = {
    id?: string; // uuid
    guestId?: string; // uuid
    guestFullName?: string | null;
    guestAvatarUrl?: string | null;
    status?: BookingStatus;
    durationStart?: string; // date
    durationEnd?: string; // date
    nights?: number; // int32
    totalPriceAmount?: number; // double
    totalPriceCurrency?: string | null;
    createdOnUtc?: string; // date-time
}

type GetConversationBookingDetailsResponse = ConversationBookingDetailsResponse
type ConversationBookingDetailsResponse = {
    bookingId?: string; // uuid
    status?: BookingStatus;
    apartmentId?: string; // uuid
    apartmentName?: string | null;
    apartmentImageUrl?: string | null;
    apartmentAddress?: string | null;
    checkIn?: string; // date
    checkOut?: string; // date
    nights?: number; // int32
    totalPriceAmount?: number; // double
    totalPriceCurrency?: string | null;
    hostName?: string | null;
    hostAvatarUrl?: string | null;
    hostPhoneNumber?: string | null;
}

type ConfirmBookingResponse = void // 204 No Content
type RejectBookingResponse = void // 204 No Content
type CancelBookingResponse = void // 204 No Content
*/
