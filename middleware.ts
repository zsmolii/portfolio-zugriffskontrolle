import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken = request.cookies.get("session")?.value

  console.log("[v0 MIDDLEWARE] Path:", pathname, "Has session:", !!sessionToken)

  // Öffentliche Pfade
  const publicPaths = ["/login", "/register", "/portfolio"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Admin-Pfade
  const isAdminPath = pathname.startsWith("/admin")

  // Wenn kein Token und geschützter Pfad → Login
  if (!sessionToken && !isPublicPath && isAdminPath) {
    console.log("[v0 MIDDLEWARE] No session, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Wenn Token vorhanden und Login/Register → Weiterleitung
  if (sessionToken && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
    console.log("[v0 MIDDLEWARE] User logged in, redirecting from login page")
    // User validieren und entsprechend weiterleiten
    try {
      const response = await fetch(new URL("/api/auth/me", request.url), {
        headers: { Cookie: `session=${sessionToken}` },
      })

      if (response.ok) {
        const data = await response.json()
        const redirectUrl = data.user.is_admin ? "/admin" : "/portfolio"
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
    } catch (error) {
      console.error("[v0 MIDDLEWARE] Error validating session:", error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
