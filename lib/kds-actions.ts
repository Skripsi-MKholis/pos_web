"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateItemStatus(itemId: string, status: 'Pending' | 'Cooking' | 'Ready' | 'Served') {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("transaction_items")
    .update({ status })
    .eq("id", itemId)

  if (error) {
    console.error("Error updating item status:", error)
    return { error: error.message }
  }

  // We revalidate paths that might display this status
  revalidatePath("/dashboard/kds")
  revalidatePath("/dashboard/tables")
  revalidatePath("/dashboard/cashier")
  
  return { success: true }
}

export async function getPendingOrders(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      id,
      created_at,
      status,
      table_id,
      tables (name),
      transaction_items (*)
    `)
    .eq("store_id", storeId)
    .eq("status", "Pending") // F&B active orders are usually Pending (Open Bill)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching orders for KDS:", error)
    return []
  }

  return data
}
