"use client"

import { useSyncExternalStore } from "react"

function subscribe(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true })
  return () => window.removeEventListener("scroll", onStoreChange)
}

/**
 * Tracks whether the page has been scrolled past `threshold` pixels.
 * Uses useSyncExternalStore for highly optimized performance.
 */
export function useScrolled(threshold = 24) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false
  )
}
