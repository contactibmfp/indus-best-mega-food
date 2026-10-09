import { site } from "@/content/site"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function LandingNavSheet({
  open,
  onOpenChange,
  pathname,
  enquireHref = "tel:+917610661111",
  enquireLabel = "Contact us · 76106 61111",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pathname: string
  enquireHref?: string
  enquireLabel?: string
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(100%,22rem)]">
        <SheetHeader>
          <SheetTitle className="text-left font-heading text-base leading-tight">
            {site.name}
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {site.nav.map((item) => {
            const active = pathname === item.href
            return (
              <SheetClose asChild key={item.href}>
                <a
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 touch-manipulation items-center rounded-lg px-3 text-base font-medium outline-none",
                    "focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </a>
              </SheetClose>
            )
          })}
        </nav>
        <div className="mt-auto space-y-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <Button
            variant="cta"
            className="h-12 w-full touch-manipulation text-base"
            asChild
          >
            <a href={enquireHref} onClick={() => onOpenChange(false)}>
              {enquireLabel}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
