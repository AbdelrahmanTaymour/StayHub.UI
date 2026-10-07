"use client"

import { Bell, Building2, ChevronDown, User } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants, Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { cn } from "cn"
import { useAuth } from "@/providers/AuthContext"

interface NavItem {
  key: string
  label: string
  href: string
}

export function SiteHeader() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const { session, status } = useAuth()

  const { logout, isPending } = useLogout()

  const isAuthenticated = status === "authenticated"

  const navItems: NavItem[] = [
    { key: "explore", label: t("explore"), href: "/" },
    {
      key: "myBookings",
      label: t("myBookings"),
      href: "/bookings",
    },
    {
      key: "favorites",
      label: t("favorites"),
      href: "/favorites",
    },
    {
      key: "messages",
      label: t("messages"),
      href: "/messages",
    },
    {
      key: "myApartments",
      label: t("myApartments"),
      href: "/owner/apartments",
    },
  ]

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-1.5 text-tertiary">
          <Building2 className="h-6.5 w-6.5" aria-hidden="true" />
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Stay<span className="text-tertiary">Hub</span>
          </span>
        </Link>

        <nav
          aria-label={t("primaryNavLabel")}
          className="hidden h-full items-center gap-6 md:flex"
        >
          {isAuthenticated &&
            navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-full items-center border-b-2 border-transparent px-1 text-sm font-medium text-foreground transition-colors hover:text-primary",
                    active && "border-primary text-tertiary"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-s border-border ps-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("notifications")}
                className="relative"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {/*
                  No unread-count source yet (features/notifications/api
                  doesn't expose a count endpoint in what I've seen) — once
                  it does, swap this for a conditionally-rendered dot
                  instead of always/never showing one.
                */}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={t("accountMenu")}
                  className="flex items-center gap-1 rounded-lg p-1 transition-colors select-none hover:bg-muted"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.avatarUrl ?? undefined}
                      alt={session?.user?.email ?? ""}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className="h-4 w-4 text-foreground"
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/*
                    No profile/settings endpoints exist yet (per the
                    product spec's own open-decisions list), so these are
                    disabled placeholders rather than links to pages that
                    don't exist.
                  */}
                  <DropdownMenuItem disabled>{t("profile")}</DropdownMenuItem>
                  <DropdownMenuItem disabled>{t("settings")}</DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isPending}
                    // onSelect={() => {
                    //   void logout()
                    // }}
                    onClick={(e) => {
                      e.preventDefault()
                      void logout()
                    }}
                  >
                    {isPending ? t("signingOut") : t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-s border-border ps-3">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
