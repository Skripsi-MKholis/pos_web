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
  revalidatePath("/dashboard/transactions")
  revalidatePath("/dashboard")
  
  return { success: true, transactionId: data?.transaction_id }
}

export async function getTransactions(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      transaction_items (
        *,
        products (image_url)
      )
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data
}

export async function getDashboardMetrics(storeId: string) {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Today's Sales
  const { data: todaySales, error: salesError } = await supabase
    .from("transactions")
    .select("total_amount")
    .eq("store_id", storeId)
    .gte("created_at", today.toISOString())
    .eq("status", "Berhasil")

  if (salesError) console.error("Metrics Error:", salesError)

  const revenue = todaySales?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0
  const count = todaySales?.length || 0

  return {
    todayRevenue: revenue,
    todaySalesCount: count,
  }
}

export async function getSalesChartData(storeId: string, days: number = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("transactions")
    .select("created_at, total_amount")
    .eq("store_id", storeId)
    .eq("status", "Berhasil")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Chart Data Error:", error)
    return []
  }

  // Group by date
  const groupedData: Record<string, { revenue: number; orders: number }> = {}
  
  // Initialize with all dates in range
  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    groupedData[d.toISOString().split("T")[0]] = { revenue: 0, orders: 0 }
  }

  data.forEach((t) => {
    const date = t.created_at.split("T")[0]
    if (groupedData[date]) {
      groupedData[date].revenue += Number(t.total_amount)
      groupedData[date].orders += 1
    }
  })

  return Object.entries(groupedData).map(([date, stats]) => ({
    date,
    revenue: stats.revenue,
    orders: stats.orders,
  }))
}
