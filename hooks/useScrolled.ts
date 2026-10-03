"use client"

import { useEffect, useState } from "react"

/**
 * Tracks whether the page has been scrolled past `threshold` pixels.
 * Uses a passive listener so it never blocks the main thread / scrolling.
 */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return scrolled
}
