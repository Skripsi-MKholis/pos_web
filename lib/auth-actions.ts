"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/select-store")
}

function getURL() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Ready for Vercel
    'http://localhost:3000'
  
  // Make sure to include `https://` if values from Vercel don't have it
  url = url.includes('http') ? url : `https://${url}`
  // Remove trailing slashes
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url
  return url
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const siteUrl = getURL()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const siteUrl = getURL()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function updateProfile(data: { full_name?: string; avatar_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard", "layout")
  return { success: true }
}
