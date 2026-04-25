"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type TransactionItem = {
  product_id: string
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
}

export type TransactionPayload = {
  storeId: string
  totalAmount: number
  paymentMethod: string
  items: TransactionItem[]
}

export async function createTransaction(payload: TransactionPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Unauthorized" }

  const { data, error } = await supabase.rpc("create_transaction_v1", {
    p_store_id: payload.storeId,
    p_cashier_id: user.id,
    p_total_amount: payload.totalAmount,
    p_payment_method: payload.paymentMethod,
    p_items: payload.items
  })

  if (error) {
    console.error("RPC Error:", error)
    return { error: error.message }
  }

  if (data?.success === false) {
    return { error: data.error || "Gagal membuat transaksi" }
  }

  revalidatePath("/dashboard/products")
  revalidatePath("/dashboard/cashier")
  
  return { success: true, transactionId: data?.transaction_id }
}
