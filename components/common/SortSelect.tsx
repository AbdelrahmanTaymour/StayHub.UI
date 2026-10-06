"use client"

import { ChevronDown } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useId, useTransition, type ChangeEvent } from "react"

import { usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "cn"

export interface SortOption {
  value: string
  label: string
}

interface SortSelectProps {
  label: string
  options: SortOption[]
  /** Removed from the URL when selected, so the default view has a clean address. */
  defaultValue: string
  /** Query parameter that stores the selection. */
  paramName?: string
  className?: string
}

export function SortSelect({
  label,
  options,
  defaultValue,
  paramName = "sort",
  className,
}: SortSelectProps) {
  const selectId = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const current = searchParams.get(paramName) ?? defaultValue

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())

    if (event.target.value === defaultValue) params.delete(paramName)
    else params.set(paramName, event.target.value)

    // A new sort starts from the first page.
    params.delete("page")

    const query = params.toString()
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={selectId} className="text-sm text-foreground">
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={current}
          onChange={handleChange}
          disabled={isPending}
          className="h-9 cursor-pointer appearance-none rounded-lg border border-input bg-card ps-3 pe-9 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-progress disabled:opacity-60"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute inset-e-2.5 top-1/2 size-4 -translate-y-1/2 text-foreground"
        />
      </div>
    </div>
  )
}
