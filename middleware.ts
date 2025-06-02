import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sessionOptions } from "./lib/session"

export function middleware(request: NextRequest) {
  // Only enforce if Discord auth is enabled
  const discordEnabled = Boolean(
    process.env.DISCORD_CLIENT_ID &&
    process.env.DISCORD_CLIENT_SECRET &&
    process.env.DISCORD_GUILD_ID &&
    process.env.DISCORD_ROLE_ID
  )
  const { pathname } = request.nextUrl

  // Allow /login and /api/auth/*
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next()
  }

  if (discordEnabled) {
    const sessionCookie = request.cookies.get(sessionOptions.cookieName)?.value
    if (!sessionCookie) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.search = ""
      return NextResponse.redirect(loginUrl)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|static|public).*)"],
} 