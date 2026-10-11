"use client"

import { useMediaQuery } from "@/hooks/useMediaQuery"

/** Matches Tailwind's `lg` breakpoint (1024px) — the chat layout's desktop/mobile split. */
export function useIsDesktopChatLayout() {
  return useMediaQuery("(min-width: 1024px)")
}
