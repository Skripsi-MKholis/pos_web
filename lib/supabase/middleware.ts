import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/setup') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/privacy') &&
    !request.nextUrl.pathname.startsWith('/terms') &&
    request.nextUrl.pathname !== '/'
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in but doesn't have an email identity (password set), 
  // redirect them to setup-password, except when already there or on auth paths
  if (user) {
    const hasEmailProvider = user.identities?.some(id => id.provider === 'email')
    const hasPasswordSet = user.user_metadata?.password_set === true
    const hasPassword = hasEmailProvider || hasPasswordSet
    
    const isSetupPasswordPage = request.nextUrl.pathname.startsWith('/setup-password')
    const isAuthPath = request.nextUrl.pathname.startsWith('/auth')
    const isExcludedPath = 
      request.nextUrl.pathname.startsWith('/privacy') || 
      request.nextUrl.pathname.startsWith('/terms') || 
      request.nextUrl.pathname === '/'

    if (!hasPassword && !isSetupPasswordPage && !isAuthPath && !isExcludedPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/setup-password'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
