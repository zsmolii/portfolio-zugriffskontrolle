"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function AdminHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Admin Dashboard
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Übersicht
            </Link>
            <Link href="/admin/companies" className="text-muted-foreground hover:text-foreground transition-colors">
              Firmen
            </Link>
            <Link href="/admin/extensions" className="text-muted-foreground hover:text-foreground transition-colors">
              Verlängerungen
            </Link>
            <Link href="/admin/invites" className="text-muted-foreground hover:text-foreground transition-colors">
              Einladungen
            </Link>
            <Link href="/admin/content" className="text-muted-foreground hover:text-foreground transition-colors">
              Inhalte
            </Link>
            <Link href="/admin/theme" className="text-muted-foreground hover:text-foreground transition-colors">
              Theme
            </Link>
            <Link href="/admin/logs" className="text-muted-foreground hover:text-foreground transition-colors">
              Aktivitäten
            </Link>
            <Link href="/admin/settings" className="text-muted-foreground hover:text-foreground transition-colors">
              Einstellungen
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </div>
    </header>
  )
}
