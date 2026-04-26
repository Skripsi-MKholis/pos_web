"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getActiveStoreId() {
  const cookieStore = await cookies()
  return cookieStore.get("active_store_id")?.value
}

export async function setActiveStoreId(storeId: string) {
  const cookieStore = await cookies()
  cookieStore.set("active_store_id", storeId, { path: "/" })
}

export async function getStores() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from("stores")
    .select("*, store_members!inner(role)")
    .eq("store_members.user_id", user.id)

  if (error) {
    console.error("Error fetching stores:", error)
    return []
  }

  return data
}

export async function createStore(name: string, address?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .insert([{ name, address, owner_id: user.id }])
    .select()
    .single()

  if (storeError) return { error: storeError.message }

  const { error: memberError } = await supabase
    .from("store_members")
    .insert([{ store_id: store.id, user_id: user.id, role: "Owner" }])

  if (memberError) return { error: memberError.message }

  return { success: true, data: store }
}

export async function updateStore(
  storeId: string, 
  data: { 
    name?: string; 
    address?: string; 
    phone?: string; 
    email?: string;
    logo_url?: string | null;
    receipt_header?: string | null;
    receipt_footer?: string | null;
    receipt_show_logo?: boolean;
    preferred_paper_size?: string;
  }
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("stores")
    .update(data)
    .eq("id", storeId)

  if (error) return { error: error.message }

  return { success: true }
}

export async function getUserRole(storeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("store_members")
    .select("role")
    .eq("store_id", storeId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) {
    console.error("Error fetching user role:", error)
    return null
  }

  return data?.role
}
