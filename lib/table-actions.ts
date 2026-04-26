"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTables(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("store_id", storeId)
    .order("name", { ascending: true })

  if (error) return { error: error.message }
  return { tables: data }
}

export async function createTable(data: { store_id: string; name: string; capacity: number }) {
  const supabase = await createClient()
  
  const { data: table, error } = await supabase
    .from("tables")
    .insert([data])
    .select()
    .single()

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/settings/tables")
  return { table }
}

export async function updateTable(id: string, data: any) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("tables")
    .update(data)
    .eq("id", id)

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/settings/tables")
  return { success: true }
}

export async function deleteTable(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("tables")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/settings/tables")
  return { success: true }
}

export async function toggleTableStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("tables")
    .update({ status })
    .eq("id", id)

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/settings/tables")
  revalidatePath("/dashboard/cashier")
  revalidatePath("/dashboard/tables")
  return { success: true }
}

export async function getTablesMonitoring(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("tables")
    .select(`
      *,
      transactions!transactions_table_id_fkey(
        id,
        total_amount,
        status,
        created_at,
        transaction_items(
          id,
          product_name,
          quantity,
          unit_price,
          subtotal
        )
      )
    `)
    .eq("store_id", storeId)
    .eq("transactions.status", "Pending")
    .order("name", { ascending: true })

  if (error) {
    console.error("Monitoring Error Detail:", error.message, error.details, error.hint)
    return { error: error.message }
  }

  return { tables: data }
}
