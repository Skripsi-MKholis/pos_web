"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function getCustomers(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return data
}

export async function createCustomer(storeId: string, data: { name: string; phone?: string; email?: string; notes?: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("customers")
    .insert([{ store_id: storeId, ...data }])

  if (error) return { error: error.message }

  revalidatePath("/dashboard/customers")
  return { success: true }
}

export async function updateCustomer(id: string, data: { name?: string; phone?: string; email?: string; notes?: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("customers")
    .update(data)
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/customers")
  return { success: true }
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/customers")
  return { success: true }
}
