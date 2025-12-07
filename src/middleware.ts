/**
 * Next.js Middleware - Authentication & Route Protection
 * =============================================================================
 * Runs before every request to:
 * 1. Refresh auth tokens if needed
 * 2. Protect routes that require authentication
 * 3. Redirect unauthenticated users to login
 */

import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/auth/callback',
  '/auth/confirm',
  '/reset-password',
]

// Routes that are always public (static assets, etc.)
const ignoredRoutes = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/icons',
  '/screenshots',
  '/templates',
  '/data',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for ignored routes
  if (ignoredRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Update session and get user
  const { supabaseResponse, user } = await updateSession(request)

  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access login/signup
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
