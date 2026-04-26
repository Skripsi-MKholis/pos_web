"use server"

import { createClient } from "@/lib/supabase/server"

export async function getGlobalInventory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get all stores the user is a member of
  const { data: stores } = await supabase
    .from("store_members")
    .select("store_id, stores(name)")
    .eq("user_id", user.id)

  if (!stores) return []

  const storeIds = stores.map(s => s.store_id)

  // Get products from all those stores
  const { data, error } = await supabase
    .from("products")
    .select("*, stores(name)")
    .in("store_id", storeIds)
    .order("name", { ascending: true })

  if (error) {
    console.error("Global Inventory Error:", error)
    return []
  }

  return data
}
