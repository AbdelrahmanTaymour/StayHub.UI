import type { QueryParameters } from "@/lib/api/type-utils"

type SearchApartmentsQuery = QueryParameters<"/api/v1/apartments", "get">
type GetFavoritesQuery = QueryParameters<"/api/v1/favorites", "get">

export const queryKeys = {
  apartments: {
    all: ["apartments"] as const,
    search: () => ["apartments", "search"] as const,
    searchList: (query?: SearchApartmentsQuery) =>
      ["apartments", "search", query] as const,
    detail: (id: string) => ["apartments", "detail", id] as const,
    pricing: (id: string, startDate: string, endDate: string) =>
      ["apartments", "detail", "pricing", id, startDate, endDate] as const,

    mine: () => [...queryKeys.apartments.all, "mine"] as const,
    mineList: (status?: string, search?: string, page?: number) =>
      [...queryKeys.apartments.mine(), { status, search, page }] as const,

    mineDashboard: () =>
      [...queryKeys.apartments.all, "mineDashboard"] as const,
    forEdit: (id: string) =>
      [...queryKeys.apartments.all, "forEdit", id] as const,
    images: (apartmentId: string) =>
      [...queryKeys.apartments.all, "images", apartmentId] as const,
    amenity: (id: string) =>
      [...queryKeys.apartments.all, "amenity", id] as const,
    staff: (apartmentId: string) =>
      [...queryKeys.apartments.all, "staff", apartmentId] as const,
    availability: (apartmentId: string) =>
      [...queryKeys.apartments.all, "availability", apartmentId] as const,
  },

  favorites: {
    all: ["favorites"] as const,
    list: (query?: GetFavoritesQuery) => ["favorites", "list", query] as const,
  },

  bookings: {
    all: ["bookings"] as const,

    mine: () => [...queryKeys.bookings.all, "mine"] as const,
    mineList: (filter?: string, page?: number) =>
      [...queryKeys.bookings.mine(), { filter, page }] as const,

    detail: (id: string) => [...queryKeys.bookings.all, "detail", id] as const,

    byApartment: (apartmentId: string) =>
      [...queryKeys.bookings.all, "byApartment", apartmentId] as const,
    byApartmentList: (
      apartmentId: string,
      status?: string,
      sort?: string,
      page?: number
    ) =>
      [
        ...queryKeys.bookings.byApartment(apartmentId),
        { status, sort, page },
      ] as const,
  },

  payments: {
    all: ["payments"] as const,
    byBooking: (bookingId: string) =>
      [...queryKeys.payments.all, "byBooking", bookingId] as const,
  },

  users: {
    all: ["users"] as const,
    me: () => [...queryKeys.users.all, "me"] as const,
    ownerProfile: (id: string) =>
      [...queryKeys.users.all, "ownerProfile", id] as const,
  },

  chats: {
    all: ["chats"] as const,
    conversations: () => [...queryKeys.chats.all, "conversations"] as const,
    messages: (conversationId: string) =>
      [...queryKeys.chats.all, "messages", conversationId] as const,
    bookingDetails: (conversationId: string) =>
      [...queryKeys.chats.all, "bookingDetails", conversationId] as const,
  },

  reviews: {
    all: ["reviews"] as const,
    byApartment: (apartmentId: string) =>
      [...queryKeys.reviews.all, "byApartment", apartmentId] as const,
    byApartmentList: (
      apartmentId: string,
      responseStatus?: string,
      rating?: string,
      sortOrder?: string,
      page?: number
    ) =>
      [
        ...queryKeys.reviews.byApartment(apartmentId),
        { responseStatus, rating, sortOrder, page },
      ] as const,
  },

  maintenance: {
    all: ["maintenance"] as const,
    byApartment: (apartmentId: string) =>
      [...queryKeys.maintenance.all, "byApartment", apartmentId] as const,
    byApartmentList: (
      apartmentId: string,
      status?: string,
      search?: string,
      page?: number
    ) =>
      [
        ...queryKeys.maintenance.byApartment(apartmentId),
        { status, search, page },
      ] as const,
    detail: (requestId: string) =>
      [...queryKeys.maintenance.all, "detail", requestId] as const,
  },

  notifications: {
    all: ["notifications"] as const,
    list: (unreadOnly?: boolean, page?: number) =>
      [...queryKeys.notifications.all, "list", { unreadOnly, page }] as const,
    unreadCount: () => [...queryKeys.notifications.all, "unreadCount"] as const,
  },
} as const
