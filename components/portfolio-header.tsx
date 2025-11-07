"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar, AlertCircle, Crown, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function PortfolioHeader() {
  const { user, logout, daysRemaining, isExpired, isAdmin } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navLinks = [
    { href: "#about", label: "Über mich" },
    { href: "#projects", label: "Projekte" },
    { href: "#skills", label: "Fähigkeiten" },
    { href: "#contact", label: "Kontakt" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/portfolio" className="font-semibold text-lg">
            Portfolio
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menü öffnen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  <Crown className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </div>
              ) : isExpired ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Zugriff abgelaufen</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">{daysRemaining} Tage verbleibend</span>
                  <span className="sm:hidden">{daysRemaining}T</span>
                </div>
              )}
            </div>
          )}
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.company_name}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </div>
    </header>
  )
}
