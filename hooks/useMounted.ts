import { useSyncExternalStore } from "react"

function subscribe() {
  return () => {}
}

/**
 * True once the component has hydrated on the client, false during SSR and
 * the first client render. Use this instead of the common
 * `useState(false)` + `useEffect(() => setState(true), [])` pattern — that
 * pattern calls setState synchronously inside an effect purely to trigger a
 * second render, which React now warns about.
 *
 * useSyncExternalStore gives the same signal (server snapshot = false,
 * client snapshot = true) without an effect or an extra render in between.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
