"use client"

import {
  BedDouble,
  CalendarDays,
  ClipboardList,
  FileText,
  Images,
  ListChecks,
  MessageSquareText,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "cn"

const TABS = [
  { segment: "details", icon: FileText },
  { segment: "images", icon: Images },
  { segment: "amenities", icon: ListChecks },
  { segment: "availability", icon: CalendarDays },
  { segment: "staff", icon: Users },
  { segment: "bookings", icon: BedDouble },
  { segment: "reviews", icon: MessageSquareText },
  { segment: "maintenance", icon: ClipboardList },
] as const

export function ManageTabsNav({ apartmentId }: { apartmentId: string }) {
  const t = useTranslations("apartmentManage.tabs")
  const pathname = usePathname()

  return (
    <nav
      aria-label={t("navLabel")}
      className="sticky top-16 z-10 -mx-4 border-b border-border bg-card/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-2"
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex gap-1 overflow-x-auto py-2"
      >
        {TABS.map(({ segment, icon: Icon }) => {
          const href = `/me/apartments/${apartmentId}/manage/${segment}`
          const isActive = pathname === href

          return (
            <Link
              key={segment}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-muted text-tertiary"
                  : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {t(segment)}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
