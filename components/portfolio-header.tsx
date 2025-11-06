"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar, AlertCircle, Crown } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function PortfolioHeader() {
  const { user, logout, daysRemaining, isExpired, isAdmin } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/portfolio" className="font-semibold text-lg">
            Portfolio
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Über mich
            </a>
            <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">
              Projekte
            </a>
            <a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">
              Fähigkeiten
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </a>
          </nav>
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
