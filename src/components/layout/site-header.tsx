import { useEffect, useState } from "react"
import { useRouterState } from "@tanstack/react-router"
import { MenuIcon, XIcon } from "lucide-react"

import { SiteBrandMark } from "@/components/brand/site-brand-mark"
import { useSiteContent } from "@/lib/site-content-context"
import { Button } from "@/components/ui/button"
import { contentContainerClass, contentGutterClass } from "@/lib/layout"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type HeaderTone = "forest" | "paper"

function BrandMark({
  className,
  tone,
}: {
  className?: string
  tone: HeaderTone
}) {
  return (
    <SiteBrandMark
      tone={tone === "forest" ? "inverse" : "color"}
      className={cn(
        "gap-2 sm:gap-2.5",
        "transition-colors duration-300",
        tone === "forest"
          ? "focus-visible:ring-3 focus-visible:ring-forest-foreground/30"
          : "focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span
        className={cn(
          "min-w-0 font-heading text-[13px] leading-[1.15] font-semibold transition-colors duration-300 sm:text-sm lg:text-[15px]",
          tone === "forest" ? "text-forest-foreground" : "text-foreground"
        )}
      >
        Indus Best Mega
        <br />
        Food Park
      </span>
    </SiteBrandMark>
  )
}

function isNavActive(href: string, pathname: string) {
  return pathname === href
}

function useOverHero() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [overHero, setOverHero] = useState(true)

  useEffect(() => {
    setOverHero(true)

    let cleanup: (() => void) | undefined
    let retryId = 0
    let retryTimeout: ReturnType<typeof setTimeout> | undefined

    const bind = () => {
      const hero = document.querySelector("[data-hero]")
      if (!hero) return false

      const update = () => {
        const header = document.querySelector("header")
        const inset = header?.getBoundingClientRect().height ?? 64
        setOverHero(hero.getBoundingClientRect().bottom > inset)
      }

      update()
      window.addEventListener("scroll", update, { passive: true })
      window.addEventListener("resize", update)
      cleanup = () => {
        window.removeEventListener("scroll", update)
        window.removeEventListener("resize", update)
      }
      return true
    }

    const attach = (final = false) => {
      cleanup?.()
      cleanup = undefined
      if (bind()) return
      if (final) setOverHero(false)
    }

    attach()
    retryId = window.requestAnimationFrame(() => attach())
    retryTimeout = setTimeout(() => attach(true), 120)

    return () => {
      cancelAnimationFrame(retryId)
      clearTimeout(retryTimeout)
      cleanup?.()
    }
  }, [pathname])

  return overHero
}

function NavLink({
  href,
  label,
  active,
  tone,
  layout = "desktop",
}: {
  href: string
  label: string
  active: boolean
  tone: HeaderTone
  layout?: "desktop" | "mobile"
}) {
  if (layout === "mobile") {
    return (
      <a
        href={href}
        aria-current={active ? "page" : undefined}
        data-state={active ? "current" : "idle"}
        className={cn(
          "flex touch-target min-h-12 items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors outline-none",
          "focus-visible:ring-3 focus-visible:ring-ring/50",
          active
            ? "bg-primary/10 text-primary hover:bg-primary/15 focus-visible:bg-primary/15"
            : "text-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted active:bg-muted/80"
        )}
      >
        {label}
      </a>
    )
  }

  const forest = tone === "forest"

  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      data-state={active ? "current" : "idle"}
      className={cn(
        "inline-flex touch-target min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium",
        "transition-colors duration-300 outline-none",
        forest
          ? "focus-visible:ring-3 focus-visible:ring-forest-foreground/30"
          : "focus-visible:ring-3 focus-visible:ring-ring/50",
        forest
          ? active
            ? "bg-forest-foreground/10 text-forest-foreground hover:bg-forest-foreground/15 focus-visible:bg-forest-foreground/15"
            : "text-forest-foreground/80 hover:bg-forest-foreground/10 hover:text-forest-foreground focus-visible:bg-forest-foreground/10 focus-visible:text-forest-foreground active:bg-forest-foreground/15 active:text-forest-foreground"
          : active
            ? "bg-primary/10 text-primary hover:bg-primary/15 focus-visible:bg-primary/15"
            : "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground active:bg-muted/80 active:text-foreground"
      )}
    >
      {label}
    </a>
  )
}

const forestIconButton =
  "border-forest-foreground/30 bg-transparent text-forest-foreground hover:bg-forest-foreground/10 hover:text-forest-foreground focus-visible:border-forest-foreground/40 focus-visible:ring-forest-foreground/30 aria-expanded:bg-forest-foreground/10 aria-expanded:text-forest-foreground"

export function SiteHeader() {
  const site = useSiteContent()
  const [open, setOpen] = useState(false)
  const overHero = useOverHero()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const tone: HeaderTone = overHero ? "forest" : "paper"

  return (
    <header
      data-tone={tone}
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color,color] duration-300",
        contentGutterClass,
        overHero
          ? "border-b border-transparent bg-forest text-forest-foreground"
          : "border-b border-border/70 bg-background/90 text-foreground shadow-[0_8px_24px_rgba(15,43,29,0.06)] backdrop-blur-md"
      )}
    >
      <div
        className={cn(
          contentContainerClass,
          "flex h-14 items-center gap-3 sm:h-16"
        )}
      >
        <BrandMark tone={tone} />

        <nav
          aria-label="Main"
          className="hidden flex-1 items-center justify-center lg:flex"
        >
          <ul className="flex items-center gap-0.5">
            {site.nav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  active={isNavActive(item.href, pathname)}
                  tone={tone}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <Button
            variant="cta"
            size="sm"
            className="hidden h-11 px-4 sm:inline-flex"
            asChild
          >
            <a href="/contact">Enquire now</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "size-11 touch-target lg:hidden",
                  overHero && forestIconButton
                )}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <XIcon /> : <MenuIcon />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left font-heading text-base leading-tight text-primary">
                  {site.name}
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {site.nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <NavLink
                      href={item.href}
                      label={item.label}
                      active={isNavActive(item.href, pathname)}
                      tone="paper"
                      layout="mobile"
                    />
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto space-y-4 px-4 pb-6">
                <Button variant="cta" className="h-11 w-full" asChild>
                  <a href="tel:+917610661111" onClick={() => setOpen(false)}>
                    Contact us · 76106 61111
                  </a>
                </Button>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <a
                      className="inline-flex touch-target min-h-11 items-center font-medium text-foreground underline-offset-2 hover:underline active:text-primary"
                      href={site.emails[0].href}
                    >
                      {site.emails[0].address}
                    </a>
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
