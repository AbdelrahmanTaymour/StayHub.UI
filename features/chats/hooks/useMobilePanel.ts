"use client"

import { usePathname } from "@/i18n/navigation"

export type ChatPanel = "list" | "thread" | "details"

/**
 * Derives the active mobile panel from the URL rather than local state, so
 * the hardware/browser back button naturally collapses thread → list instead
 * of leaving the route and the visible panel out of sync.
 */
export function useActiveMobilePanel(): ChatPanel {
  const pathname = usePathname()

  if (pathname === "/me/chats") return "list"
  // /me/chats/[chatId] or /me/chats/new — both render the thread panel on mobile.
  return "thread"
}
