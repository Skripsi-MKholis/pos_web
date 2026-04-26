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
  discountTotal?: number
  voucherInfo?: any
}

export async function createTransaction(payload: TransactionPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Unauthorized" }

  const { data, error } = await supabase.rpc("create_transaction_v2", {
    p_store_id: payload.storeId,
    p_cashier_id: user.id,
    p_total_amount: payload.totalAmount,
    p_payment_method: payload.paymentMethod,
    p_items: payload.items,
    p_discount_total: payload.discountTotal || 0,
    p_voucher_info: payload.voucherInfo || {}
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

  const { data: todayItems, error: itemsError } = await supabase
    .from("transaction_items")
    .select("subtotal, cost_price, quantity, transactions!inner(created_at, store_id, status)")
    .eq("transactions.store_id", storeId)
    .gte("transactions.created_at", today.toISOString())
    .eq("transactions.status", "Berhasil")

  if (itemsError) console.error("Metrics Items Error:", itemsError)

  const revenue = todayItems?.reduce((sum, item) => sum + Number(item.subtotal), 0) || 0
  const totalCost = todayItems?.reduce((sum, item) => sum + (Number(item.cost_price || 0) * item.quantity), 0) || 0
  const profit = revenue - totalCost

  // Unique transactions count
  const distinctTransactions = new Set(todayItems?.map(i => (i as any).transactions.id))
  const count = distinctTransactions.size

  return {
    todayRevenue: revenue,
    todaySalesCount: count,
    todayProfit: profit
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

export async function getSalesAndProfitData(storeId: string, days: number = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("transaction_items")
    .select(`
      subtotal, 
      cost_price, 
      quantity, 
      transactions!inner(created_at, store_id, status)
    `)
    .eq("transactions.store_id", storeId)
    .eq("transactions.status", "Berhasil")
    .gte("transactions.created_at", startDate.toISOString())

  if (error) {
    console.error("Profit Data Error:", error)
    return []
  }

  const groupedData: Record<string, { revenue: number; cost: number; profit: number }> = {}
  
  // Initialize range
  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    groupedData[d.toISOString().split("T")[0]] = { revenue: 0, cost: 0, profit: 0 }
  }

  data.forEach((item) => {
    const date = (item as any).transactions.created_at.split("T")[0]
    if (groupedData[date]) {
      const rev = Number(item.subtotal)
      const cost = Number(item.cost_price || 0) * item.quantity
      groupedData[date].revenue += rev
      groupedData[date].cost += cost
      groupedData[date].profit += (rev - cost)
    }
  })

  return Object.entries(groupedData).map(([date, stats]) => ({
    date,
    revenue: stats.revenue,
    profit: stats.profit,
    margin: stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0
  }))
}
