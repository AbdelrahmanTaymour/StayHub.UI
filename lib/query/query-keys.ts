import type { QueryParameters } from "@/lib/api/type-utils"

type SearchApartmentsQuery = QueryParameters<"/api/v1/apartments", "get">
type GetFavoritesQuery = QueryParameters<"/api/v1/favorites", "get">

/**
 * Single source of truth for query keys. Keys are hierarchical, so
 * invalidating a parent (e.g. apartments.all) also matches its children.
 */
export const queryKeys = {
  apartments: {
    all: ["apartments"] as const,
    search: () => ["apartments", "search"] as const,
    searchList: (query?: SearchApartmentsQuery) =>
      ["apartments", "search", query] as const,
    detail: (id: string) => ["apartments", "detail", id] as const,
    pricing: (id: string, startDate: string, endDate: string) =>
      ["apartments", "detail", "pricing", id, startDate, endDate] as const,
    mine: (status?: string, search?: string, page?: number) =>
      [...queryKeys.apartments.all, "mine", { status, search, page }] as const,
    mineDashboard: () =>
      [...queryKeys.apartments.all, "mineDashboard"] as const,
  },
  favorites: {
    all: ["favorites"] as const,
    list: (query?: GetFavoritesQuery) => ["favorites", "list", query] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    mine: (filter?: string, page?: number) =>
      [...queryKeys.bookings.all, "mine", { filter, page }] as const,
    detail: (id: string) => [...queryKeys.bookings.all, "detail", id] as const,
  },
  payments: {
    all: ["payments"] as const,
    byBooking: (bookingId: string) =>
      [...queryKeys.payments.all, "byBooking", bookingId] as const,
  },
  users: {
    all: ["users"] as const,
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
} as const
