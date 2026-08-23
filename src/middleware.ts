import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const path = request.nextUrl.pathname

  // If user is not logged in and attempts to access dashboard, redirect to login
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in and attempts to access login, redirect to dashboard
  if (path.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If request is for root "/", redirect authenticated users to dashboard
  if (path === '/' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
}
