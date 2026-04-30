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

import { getStoreSubscription, isSubscriptionGatingEnabled } from "./subscription-actions"

export async function createStore(name: string, address?: string, settings?: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // 1. Check if subscription gating is enabled
  const gatingEnabled = await isSubscriptionGatingEnabled()
  if (gatingEnabled) {
    // 2. Get existing stores owned by user
    const { data: ownedStores } = await supabase
      .from("stores")
      .select("id")
      .eq("owner_id", user.id)

    if (ownedStores && ownedStores.length > 0) {
      // 3. Check the subscription of the first store (as master)
      const sub = await getStoreSubscription(ownedStores[0].id)
      const maxOutlets = sub?.plan?.max_outlets || 1
      
      if (ownedStores.length >= maxOutlets) {
        return { 
          error: `Batas outlet tercapai. Paket ${sub?.plan?.name || 'Lite'} hanya mengizinkan ${maxOutlets} outlet. Silahkan upgrade paket anda.` 
        }
      }
    }
  }

  const insertData: any = { name, address, owner_id: user.id }
  if (settings) {
    insertData.settings = settings
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .insert([insertData])
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

export async function updateStoreSettings(storeId: string, settings: any) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("stores")
    .update({ settings })
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
