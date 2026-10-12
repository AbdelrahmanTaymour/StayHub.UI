"use client"

import { useSearchParams } from "next/navigation"

import { usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "cn"

export interface FilterTabOption {
  value: string
  label: string
}

interface FilterTabsProps {
  options: FilterTabOption[]
  defaultValue: string
  ariaLabel: string
  paramName?: string
}

/** URL-driven tab strip. Shared by My Bookings and My Apartments. */
export function FilterTabs({
  options,
  defaultValue,
  ariaLabel,
  paramName = "filter",
}: FilterTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = searchParams.get(paramName) ?? defaultValue

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === defaultValue) params.delete(paramName)
    else params.set(paramName, value)
    params.delete("page")

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-max min-w-full gap-1 overflow-x-auto rounded-xl bg-muted p-1 lg:min-w-0"
    >
      {options.map((option) => {
        const isActive = option.value === current
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-card text-tertiary shadow-sm"
                : "text-foreground hover:text-tertiary"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
