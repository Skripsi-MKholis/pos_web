"use server"

import { createClient } from "@/lib/supabase/server"

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
