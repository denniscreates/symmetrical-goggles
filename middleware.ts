import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  console.log('Middleware: pathname =', pathname, 'has token =', !!token)
  if (token) {
    console.log('Middleware: Token preview:', token.substring(0, 20) + '...')
  }

  // Public routes - allow all API routes and all pages
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Allow all routes - no authentication required
  return NextResponse.next()

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

