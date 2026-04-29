import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/setup-password'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Check if user already has a password or email identity
      const providers = user?.app_metadata?.providers || []
      const hasEmailProvider = user?.app_metadata?.provider === 'email' || providers.includes('email')
      const hasPasswordSet = user?.user_metadata?.password_set === true || user?.user_metadata?.password_set === 'true'
      
      // If user has a password and we were going to setup-password, go to select-store instead
      let targetNext = next
      if ((hasEmailProvider || hasPasswordSet) && next === '/setup-password') {
        targetNext = '/select-store'
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      const redirectUrl = isLocalEnv 
        ? `${origin}${targetNext}`
        : forwardedHost 
          ? `https://${forwardedHost}${targetNext}`
          : `${origin}${targetNext}`

      return NextResponse.redirect(redirectUrl)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`)
}
