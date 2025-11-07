import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as CookieOptions),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0 MIDDLEWARE] Path:", request.nextUrl.pathname, "User:", user?.id || "none")

  // Nur noch: Wenn kein User und geschützte Route → redirect zu /login
  // Alle anderen Fälle werden vom Auth-Context und ProtectedRoute gehandhabt
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/expired") &&
    !request.nextUrl.pathname.startsWith("/test-connection") &&
    request.nextUrl.pathname !== "/"
  ) {
    console.log("[v0 MIDDLEWARE] Redirecting to /login - no user found")
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Dies verursachte die Redirect-Schleife, weil die Login-Seite zu /admin
  // redirecten wollte, aber die Middleware ihn zu /portfolio umgeleitet hat

  return supabaseResponse
}
